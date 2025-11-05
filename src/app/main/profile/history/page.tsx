"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import { Trash2, Download } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { getTryOnHistory, deleteTryOnHistory, type TryOnHistory } from "@/lib/firebase/userActivity";
import { toast } from "react-hot-toast";

export default function TryOnHistoryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [history, setHistory] = useState<TryOnHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userHistory = await getTryOnHistory(user.uid);
      setHistory(userHistory);
    } catch (error) {
      console.error("Error loading history:", error);
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (historyId: string) => {
    if (!user) return;

    try {
      await deleteTryOnHistory(user.uid, historyId);
      setHistory((prev) => prev.filter((item) => item.id !== historyId));
      toast.success("Deleted from history");
    } catch (error) {
      console.error("Error deleting history:", error);
      toast.error("Failed to delete");
    }
  };

  const handleDownload = async (imageUrl: string, garmentName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vizzle-${garmentName.replace(/\s+/g, "-")}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Downloaded!");
    } catch (error) {
      toast.error("Download failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="relative flex items-center justify-center mb-6 py-4 bg-white shadow-sm">
        <button
          type="button"
          className="absolute left-3 text-xl"
          onClick={() => router.back()}
        >
          <IoArrowBack />
        </button>
        <h2 className="text-xl font-semibold">Try-On History</h2>
      </div>

      {/* Content */}
      <div className="px-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No try-on history yet</p>
            <p className="text-gray-400 text-sm mt-2">
              Your virtual try-ons will appear here
            </p>
            <button
              onClick={() => router.push("/main")}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] bg-gray-100">
                  <Image
                    src={item.resultImage}
                    alt={item.garmentName}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {item.garmentName}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">
                    {item.timestamp?.toDate?.()?.toLocaleDateString?.() || "Recently"}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(item.resultImage, item.garmentName)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

