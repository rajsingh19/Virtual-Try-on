"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function AuthPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push("/main");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect
  }

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-hidden">
      {/* Background Image - 60% */}
      <div className="relative w-full h-[60vh] flex items-center justify-center">
        <Image
          src="/Shopping.png"
          alt="Shopping Illustration"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Card - 40% */}
      <div className="absolute bottom-0 w-full h-[40vh] bg-white rounded-t-3xl shadow-lg z-10 px-6 py-8 text-center flex flex-col justify-center">
        <h2 className="text-[28px] font-semibold leading-none mb-3">
          Start Styling Now ✨
        </h2>

        <p className="text-[20px] font-normal text-gray-600 leading-none mb-8">
          Take your first step towards a new look with Vizzle&apos;s AR experience today!
        </p>

        <div className="flex justify-center gap-3 mb-4">
          <button
            onClick={() => router.push("/auth/login")}
            className="bg-black text-white text-[20px] font-semibold px-6 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/auth/register")}
            className="bg-black text-white text-[20px] font-semibold px-6 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Register
          </button>
        </div>

        <button
          onClick={() => router.push("/auth/login")}
          className="border border-black text-black text-[20px] font-semibold px-6 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
}
