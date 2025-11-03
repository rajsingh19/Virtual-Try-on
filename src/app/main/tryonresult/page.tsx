"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Share2 } from "lucide-react";
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa"; // 👈 social icons

export default function TryOnResultPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    if (/android/i.test(userAgent) || /iPhone|iPad|iPod/i.test(userAgent)) {
      setIsMobile(true);
    }
  }, []);

  const handleCustomShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Check out my virtual try-on look!");
    let shareUrl = "";

    switch (platform) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "instagram":
        alert("To share on Instagram, please download and upload this image manually.");
        return;
    }

    window.open(shareUrl, "_blank");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-[340px] bg-white rounded-2xl shadow-md p-5 border border-gray-100 relative">
        {/* Header */}
        <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Try On Result
        </h2>

        {/* Image Container */}
        <div className="relative rounded-xl overflow-hidden mb-4">
          <Image
            src="/v1.jpg"
            alt="Try On Result"
            width={300}
            height={400}
            className="rounded-xl"
          />

          {/* 🔹 Share Icon on Image */}
          {isMobile && (
            <button
              onClick={() => setShowShareOptions(true)}
              className="absolute top-2 right-2 bg-white/80 hover:bg-white p-2 rounded-full shadow-sm"
            >
              <Share2 className="w-5 h-5 text-gray-700" />
            </button>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between mb-2">
          <button className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700">
            Download
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Buy Now
          </button>
        </div>

        {/* Bottom Sheet Share Options */}
        {showShareOptions && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-end z-50">
            <div className="bg-white w-full rounded-t-2xl p-5 animate-slide-up">
              <h3 className="text-center font-semibold mb-4">Share on</h3>

              <div className="flex justify-around text-center">
                <button
                  onClick={() => handleCustomShare("whatsapp")}
                  className="flex flex-col items-center"
                >
                  <FaWhatsapp className="text-green-500 text-3xl" />
                  <span className="text-xs mt-1 text-green-600">WhatsApp</span>
                </button>

                <button
                  onClick={() => handleCustomShare("facebook")}
                  className="flex flex-col items-center"
                >
                  <FaFacebook className="text-blue-600 text-3xl" />
                  <span className="text-xs mt-1 text-blue-600">Facebook</span>
                </button>

                <button
                  onClick={() => handleCustomShare("instagram")}
                  className="flex flex-col items-center"
                >
                  <FaInstagram className="text-pink-500 text-3xl" />
                  <span className="text-xs mt-1 text-pink-500">Instagram</span>
                </button>
              </div>

              <button
                onClick={() => setShowShareOptions(false)}
                className="mt-5 w-full py-2 text-gray-600 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {!isMobile && (
          <p className="text-xs text-gray-400 text-center mt-3">
            Share available only on mobile devices
          </p>
        )}

        <p className="text-center text-sm text-blue-500 mt-4 cursor-pointer">
          Try another outfit
        </p>
      </div>
    </div>
  );
}
