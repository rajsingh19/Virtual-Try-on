"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
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
        
        <h1 className="text-lg font-bold text-gray-900">Privacy Policy</h1>
        <div className="w-5" /> {/* spacing placeholder */}
      </div>

      {/* 🔹 Privacy Policy Content */}
      <div className="px-4 mt-6 pb-10">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col space-y-4">
          

          

          <p className="text-sm text-gray-700 leading-relaxed">
            Welcome to <strong>Vizzle</strong> (“we”, “our”, “us”). This Privacy
            Policy describes how we collect, use, and protect your personal
            information when you use our mobile application (“App”) and related
            services.
          </p>

          <p className="text-sm text-gray-700 leading-relaxed">
            By using Vizzle, you agree to the collection and use of information
            in accordance with this policy.
          </p>

          {/* 🔹 Section 1 */}
          <h2 className="font-semibold text-gray-800">1. Information We Collect</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            We may collect the following types of information to provide and
            improve our services:
          </p>

          <p className="text-sm text-gray-700 leading-relaxed mt-2">
            <strong>a. Personal Information</strong>
            <br />
            When you create an account or interact with the app, we may collect:
            <br />– Name <br />– Email address <br />– Mobile number (if
            provided)
          </p>

          <p className="text-sm text-gray-700 leading-relaxed mt-2">
            <strong>b. Usage Information</strong>
            <br />
            We automatically collect certain information when you use the app,
            such as:
            <br />– Device information (model, OS version, unique identifiers)
            <br />– App usage data (features used, time spent, preferences)
            <br />– IP address and general location data
          </p>

          <p className="text-sm text-gray-700 leading-relaxed mt-2">
            <strong>c. Media and Files</strong>
            <br />
            If you use our visual try-on or AR features, we may request access to:
            <br />– Your device’s camera (to visualize products on you in AR)
            <br />– Your gallery or uploaded images (if you choose to use them
            for visualization)
            <br />
            We do not store or share these media files unless you explicitly
            save or share them within the app.
          </p>

          {/* 🔹 Section 2 */}
          <h2 className="font-semibold text-gray-800">2. How We Use Your Information</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            We use the collected data to:
            <br />– Provide and improve app functionality
            <br />– Personalize your experience and product recommendations
            <br />– Troubleshoot issues and enhance performance
            <br />– Communicate updates, offers, or support information
            <br />– Analyze app usage to improve our features
          </p>

          {/* 🔹 Section 3 */}
          <h2 className="font-semibold text-gray-800">3. How We Share Your Information</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            We do not sell your personal data. We may share limited data only in
            the following cases:
            <br />– With trusted partners (e.g., affiliate partners like Amazon
            or Myntra) for product redirection or purchase tracking.
            <br />– With service providers that help us operate or analyze our
            app (under strict confidentiality agreements).
            <br />– For legal reasons, if required by law or to protect the
            rights and safety of users and Vizzle.
          </p>

          {/* 🔹 Section 4 */}
          <h2 className="font-semibold text-gray-800">4. Data Retention</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            We retain your personal information only as long as necessary for
            the purposes stated above or as required by law. You can request
            deletion of your data anytime by contacting us at{" "}
            <a
              href="mailto:contact@vizzle.com"
              className="text-blue-600 hover:underline"
            >
              info@vizzle.in
            </a>
            .
          </p>

          {/* 🔹 Section 5 */}
          <h2 className="font-semibold text-gray-800">5. Your Rights</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            You have the right to:
            <br />– Access or correct your personal data
            <br />– Withdraw consent for data processing
            <br />– Request deletion of your account or data
            <br />
            To exercise these rights, contact us at{" "}
            <a
              href="mailto:support@vizzle.com"
              className="text-blue-600 hover:underline"
            >
               info@vizzle.in
            </a>
            .
          </p>

          {/* 🔹 Section 6 */}
          <h2 className="font-semibold text-gray-800">6. Security of Your Information</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            We use appropriate security measures (encryption, secure servers,
            limited access) to protect your data. However, no method of
            transmission over the internet or mobile network is 100% secure.
          </p>

          {/* 🔹 Section 7 */}
          <h2 className="font-semibold text-gray-800">7. Third-Party Links and Services</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Our app may contain links to external sites (like Amazon or Myntra)
            through affiliate programs. Please note that these third-party sites
            are not operated by us. We advise you to review their privacy
            policies separately.
          </p>

          {/* 🔹 Section 8 */}
          <h2 className="font-semibold text-gray-800">8. Children’s Privacy</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Our services are not directed toward individuals under 13 years of
            age. We do not knowingly collect data from children. If we discover
            such data, we will delete it immediately.
          </p>

          {/* 🔹 Section 9 */}
          <h2 className="font-semibold text-gray-800">9. Changes to This Policy</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            We may update this Privacy Policy from time to time. Any changes
            will be reflected by updating the “Effective Date” at the top of
            this page. Continued use of the app means you accept those changes.
          </p>

          {/* 🔹 Section 10 */}
          <h2 className="font-semibold text-gray-800">10. Contact Us</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            If you have any questions, concerns, or requests about this Privacy
            Policy, please contact us at:
            <br />
            📧{" "}
            <a
              href="mailto:help@vizzle.com"
              className="text-blue-600 hover:underline"
            >
               info@vizzle.in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
