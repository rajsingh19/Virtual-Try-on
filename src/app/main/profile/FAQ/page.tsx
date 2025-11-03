"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Shield } from "lucide-react";


export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 🔹 Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white shadow-sm rounded-b-xl">
        <button
          onClick={() => router.back()}
          className="p-1 rounded-full hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </button>

        <div className="flex items-center space-x-2">
          
          <h1 className="text-lg font-bold text-gray-900">FAQ</h1>
        </div>

        <div className="w-5" /> {/* spacing placeholder */}
      </div>

      {/* 🔹 Content Section */}
      <div className="flex-1 p-6 mx-3 my-5 bg-white rounded-2xl shadow-md overflow-y-auto leading-relaxed text-gray-800">
        

        <p className="mb-4">
          Welcome to <span className="font-semibold">Vizzle</span> (“we”, “our”, “us”). 
          These Terms and Conditions (“Terms”) govern your use of our mobile application (“App”) and related services.
        </p>

        {/* Section 1 */}
        <Section title="1. What is Vizzle?">
          Vizzle is an <b>AR-powered virtual try-on platform</b> that allows users to visualize clothes and accessories 
          on their own photo before purchasing.
        </Section>

        {/* Section 2 */}
        <Section title="2. How does it work?">
          By combining <b>AR and AI technology</b>, Vizzle lets users upload a photo, select a product, and instantly preview 
          how it would look — enhancing confidence in every purchase.
        </Section>

        {/* Section 3 */}
        <Section title="3. Is my data secure?">
          Yes. <b>Vizzle prioritizes user privacy</b>, ensuring all uploaded images and personal data are processed securely 
          and never shared with third parties.
        </Section>

       
      </div>
    </div>
  );
}

/* ✅ Helper Component for clean section design */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="font-semibold text-gray-900 mb-2">{title}</h2>
      <div className="text-gray-700 text-sm">{children}</div>
    </div>
  );
}
