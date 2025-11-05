"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, firestore } from "@/firebase/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [fbLoading, setFbLoading] = useState(false);

  // Import useAuth to check if user is already logged in
  const { user, loading: authLoading } = typeof window !== 'undefined' ? require('@/contexts/AuthContext').useAuth() : { user: null, loading: false };

  // Redirect if already logged in
  if (typeof window !== 'undefined') {
    React.useEffect(() => {
      if (!authLoading && user) {
        router.push("/main");
      }
    }, [user, authLoading]);
  }

  // 🔹 Handle Email Registration
  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save data to Firestore
      await setDoc(doc(firestore, "users", user.uid), {
        firstName,
        lastName,
        gender,
        email,
        providers: ["password"],
      });

      // Save user data temporarily (for login use)
      localStorage.setItem("registrationData", JSON.stringify({ firstName, lastName, gender }));

      await sendEmailVerification(user);
      alert("Verification email sent! Please verify before logging in.");
      router.push("/auth/login");
    } catch (error) {
      console.error("Register error:", error);
      if (error instanceof Error) setError(error.message);
      else setError("An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle Google Sign-Up (with Auto-Linking)
  const handleGoogleRegister = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      if (!auth) {
        throw new Error("Firebase authentication not initialized");
      }

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!firestore) {
        throw new Error("Firestore not initialized");
      }

      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          firstName: user.displayName?.split(" ")[0] || "",
          lastName: user.displayName?.split(" ")[1] || "",
          gender: "",
          email: user.email,
          providers: ["google.com"],
        });
      } else {
        // update providers if needed
        const existingProviders = userDoc.data()?.providers || [];
        if (!existingProviders.includes("google.com")) {
          await setDoc(userDocRef, { providers: [...existingProviders, "google.com"] }, { merge: true });
        }
      }

      router.push("/main");
    } catch (error: any) {
      console.error("Google register error:", error);

      // Handle specific error codes
      if (error.code === 'auth/popup-closed-by-user') {
        setError("Sign-in cancelled. Please try again.");
        setGoogleLoading(false);
        return;
      } else if (error.code === 'auth/popup-blocked') {
        setError("Popup blocked. Please allow popups for this site.");
        setGoogleLoading(false);
        return;
      } else if (error.code === 'auth/cancelled-popup-request') {
        // User opened multiple popups, ignore this error
        setGoogleLoading(false);
        return;
      }

      if (error.code === "auth/account-exists-with-different-credential") {
        const pendingCred = GoogleAuthProvider.credentialFromError(error);
        const email = error.customData?.email;

        if (email) {
          const methods = await fetchSignInMethodsForEmail(auth, email);

          // Case: Existing with Facebook
          if (methods.includes("facebook.com")) {
            const fbProvider = new FacebookAuthProvider();
            const fbResult = await signInWithPopup(auth, fbProvider);
            const user = fbResult.user;

            if (pendingCred) await linkWithCredential(user, pendingCred);

            alert("Your Google account has been linked to your Facebook login.");
            router.push("/main");
          }

          // Case: Existing with Email/Password
          else if (methods.includes("password")) {
            const password = prompt(
              `An account with ${email} exists. Please enter your password to link Google:`
            );
            if (password) {
              const emailResult = await signInWithEmailAndPassword(auth, email, password);
              const user = emailResult.user;

              if (pendingCred) await linkWithCredential(user, pendingCred);

              alert("Your Google account has been linked to your Email login.");
              router.push("/main");
            }
          }
        }
      } else {
        setError(error.message || "An unknown error occurred");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // 🔹 Handle Facebook Sign-Up (with Auto-Linking)
  const handleFacebookRegister = async () => {
    setError(null);
    setFbLoading(true);
    try {
      if (!auth) {
        throw new Error("Firebase authentication not initialized");
      }

      const provider = new FacebookAuthProvider();
      provider.setCustomParameters({
        display: 'popup'
      });
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!firestore) {
        throw new Error("Firestore not initialized");
      }

      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          firstName: user.displayName?.split(" ")[0] || "",
          lastName: user.displayName?.split(" ")[1] || "",
          gender: "",
          email: user.email,
          providers: ["facebook.com"],
        });
      } else {
        // update providers if needed
        const existingProviders = userDoc.data()?.providers || [];
        if (!existingProviders.includes("facebook.com")) {
          await setDoc(userDocRef, { providers: [...existingProviders, "facebook.com"] }, { merge: true });
        }
      }

      router.push("/main");
    } catch (error: any) {
      console.error("Facebook register error:", error);

      // Handle specific error codes
      if (error.code === 'auth/popup-closed-by-user') {
        setError("Sign-in cancelled. Please try again.");
        setFbLoading(false);
        return;
      } else if (error.code === 'auth/popup-blocked') {
        setError("Popup blocked. Please allow popups for this site.");
        setFbLoading(false);
        return;
      } else if (error.code === 'auth/cancelled-popup-request') {
        // User opened multiple popups, ignore this error
        setFbLoading(false);
        return;
      }

      if (error.code === "auth/account-exists-with-different-credential") {
        const pendingCred = FacebookAuthProvider.credentialFromError(error);
        const email = error.customData?.email;

        if (email) {
          const methods = await fetchSignInMethodsForEmail(auth, email);

          // Case 1: Existing with Google
          if (methods.includes("google.com")) {
            const googleProvider = new GoogleAuthProvider();
            const googleResult = await signInWithPopup(auth, googleProvider);
            const user = googleResult.user;

            if (pendingCred) await linkWithCredential(user, pendingCred);

            alert("Your Facebook account has been linked to your Google login.");
            router.push("/main");
          }

          // Case 2: Existing with Email/Password
          else if (methods.includes("password")) {
            const password = prompt(
              `An account with ${email} exists. Please enter your password to link Facebook:`
            );
            if (password) {
              const emailResult = await signInWithEmailAndPassword(auth, email, password);
              const user = emailResult.user;

              if (pendingCred) await linkWithCredential(user, pendingCred);

              alert("Your Facebook account has been linked to your Email login.");
              router.push("/main");
            }
          }
        }
      } else {
        setError(error.message || "An unknown error occurred");
      }
    } finally {
      setFbLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-[380px] bg-white p-6 rounded-2xl shadow-md">
        {/* Header */}
        <div className="relative flex items-center justify-center mb-6">
          <button
            type="button"
            className="absolute left-0 text-xl"
            onClick={() => window.history.back()}
          >
            <IoArrowBack />
          </button>
          <h2 className="text-2xl font-semibold">Register</h2>
        </div>

        {/* Google Register */}
        <button
          type="button"
          onClick={handleGoogleRegister}
          disabled={googleLoading}
          className="flex items-center justify-center w-full gap-2 bg-black text-white py-3 rounded-lg mb-3 hover:opacity-90"
        >
          <FcGoogle className="text-xl" />
          {googleLoading ? "Registering..." : "Register with Google"}
        </button>

        {/* Facebook Register */}
        <button
          type="button"
          onClick={handleFacebookRegister}
          disabled={fbLoading}
          className="flex items-center justify-center w-full gap-2 bg-black text-white py-3 rounded-lg mb-6 hover:opacity-90"
        >
          <FaFacebook className="text-blue-500 text-xl" />
          {fbLoading ? "Registering..." : "Register with Facebook"}
        </button>

        {/* Divider */}
        <div className="flex items-center mb-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-sm text-gray-500">Or register with email</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Email Registration Form */}
        <form onSubmit={handleRegister}>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                className="absolute right-3 top-2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </button>
            </div>
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                className="absolute right-3 top-2 text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 mb-4 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
