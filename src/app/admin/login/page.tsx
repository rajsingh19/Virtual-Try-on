"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { IoArrowBack } from "react-icons/io5";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Shield, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { isAdmin } from "@/lib/firebase/products";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already logged in as admin
    if (user && isAdmin(user.email)) {
      router.push("/admin/dashboard");
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check admin credentials
    if (email !== "admin@gmail.com") {
      toast.error("Access denied. Admin credentials required.");
      return;
    }

    if (password !== "admin123") {
      toast.error("Invalid admin password.");
      return;
    }

    setLoading(true);

    try {
      if (!auth) throw new Error("Firebase not initialized");

      // Try to login with Firebase
      await signInWithEmailAndPassword(auth, email, password);
      
      toast.success("Admin login successful!");
      router.push("/admin/dashboard");
    } catch (error: any) {
      console.error("Admin login error:", error);
      
      // If account doesn't exist, inform admin
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        toast.error("Admin account not found. Click 'Create Admin Account' button below.", {
          duration: 5000,
        });
      } else if (error.code === 'auth/wrong-password' || error.message.includes('INVALID_LOGIN_CREDENTIALS')) {
        toast.error("Invalid credentials. Please create admin account first.", {
          duration: 5000,
        });
      } else {
        toast.error("Login failed. Please create admin account first.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="relative flex flex-col items-center mb-6">
            <button
              type="button"
              className="absolute left-0 top-0 text-xl text-gray-600 hover:text-gray-800"
              onClick={() => router.push("/")}
            >
              <IoArrowBack />
            </button>
            
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
            <p className="text-gray-500 text-sm mt-2">Secure access to admin panel</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <AiOutlineEye className="text-xl" />
                  ) : (
                    <AiOutlineEyeInvisible className="text-xl" />
                  )}
                </button>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                <strong>Admin Credentials:</strong><br />
                Email: admin@gmail.com<br />
                Password: admin123
              </p>
            </div>

            {/* Create Admin Account Button */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-800 mb-2">
                <strong>First time?</strong> Create admin account first:
              </p>
              <button
                type="button"
                onClick={() => router.push("/auth/register")}
                className="w-full text-sm bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition font-medium"
              >
                Create Admin Account
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Login as Admin
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Authorized personnel only. All actions are logged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

