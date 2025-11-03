"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-5">
      {/* 🔹 Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white shadow-sm rounded-b-xl">
        <button
          onClick={() => router.back()}
          className="p-1 rounded-full hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </button>

        <div className="flex items-center space-x-2">
         
          <h1 className="text-lg font-bold text-gray-900">Terms & Conditions</h1>
        </div>

        <div className="w-5" /> {/* spacing placeholder */}
      </div>

      {/* 🔹 Content Section */}
      <div className="flex-1 p-6 mx-3 my-5 bg-white rounded-2xl shadow-md overflow-y-auto leading-relaxed text-gray-800">
        

        <p className="mb-4">
          Welcome to <span className="font-semibold">Vizzle</span> (“we”, “our”, “us”). These Terms and Conditions (“Terms”)
          govern your use of our mobile application (“App”) and related services.
          By downloading, accessing, or using Vizzle, you agree to be bound by these Terms.
          If you do not agree, please do not use the App.
        </p>

        {/* Section 1 */}
        <Section title="1. About Vizzle">
          Vizzle is a visual try-on and shopping assistance app that allows users to virtually try clothes and accessories before purchasing.
          We aim to enhance your online shopping experience through augmented reality (AR) and affiliate integrations.
        </Section>

        {/* Section 2 */}
        <Section title="2. User Eligibility">
          By using this App, you confirm that:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>You are at least 13 years old (or the legal age in your region).</li>
            <li>You agree to comply with all local laws and regulations.</li>
            <li>If you are using the App on behalf of a business, you have authority to agree to these Terms on its behalf.</li>
          </ul>
        </Section>

        {/* Section 3 */}
        <Section title="3. Use of the App">
          You agree to use the App only for lawful purposes and in accordance with these Terms.
          You agree not to:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Misuse or interfere with the App’s functionality.</li>
            <li>Upload or share any harmful, offensive, or infringing content.</li>
            <li>Attempt to reverse-engineer, modify, or copy the App’s code or design.</li>
            <li>Use the App for unauthorized commercial purposes.</li>
          </ul>
        </Section>

        {/* Section 4 */}
        <Section title="4. Account and Registration">
          To access certain features, you may need to create an account. You are responsible for:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Keeping your login credentials secure.</li>
            <li>Providing accurate and up-to-date information.</li>
            <li>All activities that occur under your account.</li>
          </ul>
          We reserve the right to suspend or terminate your account if you violate these Terms.
        </Section>

        {/* Section 5 */}
        <Section title="5. Affiliate Links and Third-Party Content">
          Vizzle may display links to products from third-party platforms (e.g., Amazon, Myntra, etc.).
          <br />
          Please note:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>We do not sell any products directly.</li>
            <li>We may earn a small commission from affiliate links when you make a purchase through our App.</li>
            <li>We are not responsible for transactions, returns, or disputes on third-party websites.</li>
          </ul>
          We encourage you to review third-party policies before making a purchase.
        </Section>

        {/* Section 6 */}
        <Section title="6. App Permissions">
          To function properly, Vizzle may request access to:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><b>Camera</b> – to enable AR try-on features.</li>
            <li><b>Gallery/Media</b> – if you upload or use your own image for visualization.</li>
          </ul>
          You can manage these permissions anytime in your device settings.
        </Section>

        {/* Section 7 */}
        <Section title="7. Intellectual Property">
          All content, features, logos, and designs within Vizzle are owned by or licensed to us.
          You may not copy, modify, distribute, or use our intellectual property without prior written permission.
        </Section>

        {/* Section 8 */}
        <Section title="8. Disclaimer of Warranties">
          The App is provided on an “as is” and “as available” basis. We do not guarantee:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>The App will always function without errors or interruptions.</li>
            <li>The accuracy or completeness of affiliate information.</li>
          </ul>
          Your use of the App is at your own risk.
        </Section>

        {/* Section 9 */}
        <Section title="9. Limitation of Liability">
          To the fullest extent permitted by law:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Vizzle and its team shall not be liable for indirect, incidental, or consequential damages.</li>
            <li>We are not responsible for losses from third-party websites, purchases, or inaccurate product visuals.</li>
          </ul>
        </Section>

        {/* Section 10 */}
        <Section title="10. Termination">
          We may suspend or terminate your access to Vizzle at any time, with or without notice, for:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Violation of these Terms</li>
            <li>Fraudulent, illegal, or abusive activity</li>
            <li>Technical or security reasons</li>
          </ul>
          Upon termination, your right to use the App will cease immediately.
        </Section>

        {/* Section 11 */}
        <Section title="11. Updates and Modifications">
          We may update or modify these Terms from time to time. We will notify you of significant changes by updating the “Effective Date” above.
          Continued use of the App means you accept the revised Terms.
        </Section>

        {/* Section 12 */}
        <Section title="12. Governing Law">
          These Terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts located in <span className="font-medium">[Your City/State, e.g., Bengaluru, Karnataka]</span>.
        </Section>

        {/* Section 13 */}
        <Section title="13. Contact Us">
          If you have any questions about these Terms, please contact us at:
          <br />
          📧{" "}
          <Link
            href="mailto:info@vizzle.in"
            className="text-blue-600 hover:underline font-medium"
          >
            info@vizzle.in
          </Link>
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
