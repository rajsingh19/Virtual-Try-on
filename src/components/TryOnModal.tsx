"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Loader2, Download, Share2, Sparkles, Video } from "lucide-react";
import { VizzleAPI } from "@/lib/api/vizzle-api";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { saveTryOnHistory } from "@/lib/firebase/userActivity";

interface TryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  humanImage: string; // Base64 or URL
  garmentImage: string; // URL from product
  garmentName: string;
  onSuccess?: (resultUrl: string) => void;
}

export default function TryOnModal({
  isOpen,
  onClose,
  humanImage,
  garmentImage,
  garmentName,
  onSuccess,
}: TryOnModalProps) {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoStatusMessage, setVideoStatusMessage] = useState("");

  useEffect(() => {
    if (isOpen && !resultUrl) {
      handleTryOn();
    }
    // Reset video state when modal closes
    if (!isOpen) {
      setVideoUrl(null);
      setVideoProgress(0);
      setVideoStatusMessage("");
      setIsGeneratingVideo(false);
    }
  }, [isOpen]);

  const handleTryOn = async () => {
    // Reset video state for new try-on
    setVideoUrl(null);
    setVideoProgress(0);
    setVideoStatusMessage("");
    setIsGeneratingVideo(false);

    setIsProcessing(true);
    setProgress(10);
    setStatusMessage("Uploading your photo...");

    try {
      // Convert base64 to File if needed with cache-busting
      let humanFile: File;
      if (humanImage.startsWith("data:")) {
        const response = await fetch(humanImage, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
          },
        });
        const blob = await response.blob();
        humanFile = new File([blob], `human_${Date.now()}.jpg`, { 
          type: "image/jpeg",
          lastModified: Date.now(),
        });
      } else {
        // If URL, fetch it with cache-busting
        const cacheBuster = humanImage.includes('?') ? '&' : '?';
        const urlWithCache = `${humanImage}${cacheBuster}_t=${Date.now()}`;
        const response = await fetch(urlWithCache, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
          },
        });
        const blob = await response.blob();
        humanFile = new File([blob], `human_${Date.now()}.jpg`, { 
          type: "image/jpeg",
          lastModified: Date.now(),
        });
      }

      // Upload human image
      const humanUploadResponse = await VizzleAPI.uploadHumanImage(humanFile);
      setProgress(30);
      setStatusMessage("Uploading garment...");

      // Download garment from URL and upload with cache-busting
      const cacheBuster = garmentImage.includes('?') ? '&' : '?';
      const garmentUrlWithCache = `${garmentImage}${cacheBuster}_t=${Date.now()}`;
      const garmentResponse = await fetch(garmentUrlWithCache, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      });
      const garmentBlob = await garmentResponse.blob();
      const garmentFile = new File([garmentBlob], `garment_${Date.now()}.jpg`, {
        type: "image/jpeg",
        lastModified: Date.now(),
      });

      const garmentUploadResponse = await VizzleAPI.uploadGarmentImage(garmentFile);
      setProgress(50);
      setStatusMessage("Creating your virtual try-on...");

      // Perform virtual try-on
      const tryOnResponse = await VizzleAPI.performVirtualTryOn({
        human_img: humanUploadResponse.url,
        garm_img: garmentUploadResponse.url,
        garment_type: "auto_detect",
        use_vision: true,
        params: {
          category: "upper_body",
          crop: false,
          force_dc: false,
          mask_only: false,
          steps: 20,
          seed: 42,
        },
      });

      setProgress(70);
      setStatusMessage("Processing... This may take 30-60 seconds");

      // Wait for completion
      const result = await VizzleAPI.waitForVirtualTryOn(tryOnResponse.id);

      if (result.status === "succeeded" && result.output) {
        const outputUrl = Array.isArray(result.output)
          ? result.output[0]
          : result.output;
        setResultUrl(outputUrl as string);
        setProgress(100);
        setStatusMessage("Complete!");
        toast.success("Try-on created successfully!");

        // Save to Firebase if user is logged in
        if (user) {
          try {
            await saveTryOnHistory(user.uid, {
              humanImage: humanUploadResponse.url,
              garmentImage: garmentUploadResponse.url,
              resultImage: outputUrl as string,
              garmentName,
              garmentType: "auto_detect",
            });
          } catch (error) {
            console.error("Failed to save history:", error);
            // Don't show error to user, just log it
          }
        }

        if (onSuccess) {
          onSuccess(outputUrl as string);
        }
      } else if (result.status === "failed") {
        throw new Error(result.error || "Try-on failed");
      }
    } catch (error) {
      console.error("Try-on error:", error);
      toast.error(error instanceof Error ? error.message : "Try-on failed");
      setStatusMessage("Failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!resultUrl) return;

    try {
      const response = await fetch(resultUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vizzle-tryon-${garmentName}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Downloaded successfully!");
    } catch (error) {
      toast.error("Download failed");
    }
  };

  const handleShare = async () => {
    if (!resultUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Virtual Try-On",
          text: `Check out how ${garmentName} looks on me!`,
          url: resultUrl,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(resultUrl);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleGenerateVideo = async () => {
    if (!resultUrl) {
      toast.error("Please complete try-on first");
      return;
    }

    setIsGeneratingVideo(true);
    setVideoProgress(10);
    setVideoStatusMessage("Initializing video generation...");

    try {
      // Generate video from the try-on result image
      const videoResponse = await VizzleAPI.generateVideo({
        image_url: resultUrl,
        motion_type: "subtle_walk",
        duration: 3,
        fps: 24,
      });

      setVideoProgress(30);
      setVideoStatusMessage("Generating video... This may take 60-90 seconds");

      // Wait for video generation to complete
      const videoResult = await VizzleAPI.waitForVideo(videoResponse.id);

      if (videoResult.status === "succeeded" && videoResult.video_url) {
        setVideoUrl(videoResult.video_url);
        setVideoProgress(100);
        setVideoStatusMessage("Video ready!");
        toast.success("Video generated successfully!");
      } else if (videoResult.status === "failed") {
        throw new Error(videoResult.error || "Video generation failed");
      }
    } catch (error) {
      console.error("Video generation error:", error);
      toast.error(error instanceof Error ? error.message : "Video generation failed");
      setVideoStatusMessage("Failed. Please try again.");
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleDownloadVideo = async () => {
    if (!videoUrl) return;

    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vizzle-tryon-video-${garmentName.replace(/\s+/g, "-")}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Video downloaded successfully!");
    } catch (error) {
      toast.error("Video download failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            Virtual Try-On
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Processing State */}
          {isProcessing && !resultUrl && (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="relative">
                <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">
                    {progress}%
                  </span>
                </div>
              </div>
              <p className="mt-4 text-gray-600 text-center">{statusMessage}</p>
              <div className="w-full max-w-xs mt-4 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Result State */}
          {resultUrl && (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="relative">
                <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">
                    90%
                  </span>
                </div>
              </div>
              <p className="mt-4 text-gray-600 text-center">{statusMessage}</p>
              <div className="w-full max-w-xs mt-4 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${90}%` }}
                />
              </div>
            </div>
          )}

          {/* Error State */}
          {!isProcessing && !resultUrl && statusMessage.includes("Failed") && (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-gray-600 text-center mb-4">{statusMessage}</p>
              <button
                onClick={() => {
                  setResultUrl(null);
                  setStatusMessage("");
                  handleTryOn();
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

