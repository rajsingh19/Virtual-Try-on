"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Link, MapPin } from "lucide-react";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 🔹 Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white shadow-sm rounded-b-xl">
        <button
          onClick={() => router.back()}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Connect with Us</h1>
        <div className="w-5" /> {/* spacing placeholder */}
      </div>

      {/* 🔹 About Content */}
      <div className="px-4 mt-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-3">
           
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
           📩 To collaborate or list your brand on Vizzle, reach out to us at {" "}
          <a
            href="mailto:info@vizzle.in"
            className="text-blue-600 hover:underline font-medium"
          >
            info@vizzle.in
          </a>
          </p>
        </div>
      </div>
    </div>
  );
}
