"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Eye, Trash2, X, Sparkles, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import TryOnModal from "@/components/TryOnModal";
import { toast } from "react-hot-toast";
import { useTryOnPageStore } from "@/app/store/tryonPageStore";

function TryOnPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tab, setTab] = useState("single");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const modelInputRef = useRef<HTMLInputElement>(null);
  const [showTryOnModal, setShowTryOnModal] = useState(false);
  const [selectedGarmentForTryOn, setSelectedGarmentForTryOn] =
    useState<any>(null);

  // Use Zustand store for state management
  const {
    modelImage,
    garments,
    originTab,
    setModelImage,
    setGarments,
    addGarment,
    removeGarment,
    setOriginTab,
  } = useTryOnPageStore();

  // In-memory storage for large images that can't be persisted
  const [largeModelImage, setLargeModelImage] = useState<string | null>(null);
  const [largeGarmentImages, setLargeGarmentImages] = useState<Map<number, string>>(new Map());

  useEffect(() => {
    // Clean up old large localStorage items that might cause quota issues
    try {
      const oldModelImage = localStorage.getItem("modelImage");
      if (oldModelImage && oldModelImage.startsWith('data:')) {
        const size = (oldModelImage.length * 3) / 4;
        if (size > 1 * 1024 * 1024) {
          // Remove large old model image
          localStorage.removeItem("modelImage");
          console.log("Removed large model image from localStorage");
        }
      }
    } catch (error) {
      // Ignore errors during cleanup
    }

    // Load garments from localStorage (legacy support)
    try {
      const stored = JSON.parse(localStorage.getItem("tryonProducts") || "[]");
      if (stored.length > 0) {
        // Filter out large base64 images from stored garments
        const filtered = stored.map((garment: any) => {
          if (garment.image && garment.image.startsWith('data:')) {
            const size = (garment.image.length * 3) / 4;
            if (size > 1 * 1024 * 1024) {
              return { ...garment, image: '' };
            }
          }
          return garment;
        });
        setGarments(filtered);
      }
    } catch (error) {
      console.error("Error loading garments from localStorage:", error);
      // If there's an error, try to clear the corrupted data
      try {
        localStorage.removeItem("tryonProducts");
      } catch (e) {
        // Ignore
      }
    }

    const tabFromURL = searchParams.get("tab");
    if (tabFromURL === "multiple" || tabFromURL === "single") {
      setTab(tabFromURL);
      setOriginTab(tabFromURL);
    } else {
      if (originTab) setTab(originTab);
    }
  }, [searchParams, setGarments, setOriginTab, originTab]);

  const handleAddGarment = () => {
    setOriginTab(tab);
    router.push(`/main?tab=${tab}`);
  };

  const handleDeleteGarment = (index: number) => {
    const garment = garments[index];
    if (garment) {
      // Remove from large images map if exists
      const newLargeImages = new Map(largeGarmentImages);
      newLargeImages.delete(garment.id);
      setLargeGarmentImages(newLargeImages);
    }
    removeGarment(index);
  };

  const handleModelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Reset input immediately to allow same file to be selected again
      if (event.target) {
        event.target.value = "";
      }
      
      // Check file size before reading (limit to 2MB for base64)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image file is too large. Please use an image smaller than 2MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Check if base64 is too large for localStorage
        const base64Size = (result.length * 3) / 4;
        if (base64Size > 1 * 1024 * 1024) {
          // Store in memory only, not localStorage
          setLargeModelImage(result);
          setModelImage(null); // Clear persisted version
          toast.success("Image loaded (too large to save, will be lost on page refresh)");
        } else {
          // Small enough to persist
          setModelImage(result);
          setLargeModelImage(null);
        }
      };
      reader.onerror = () => {
        toast.error("Failed to read image file");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveModel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModelImage(null);
    setLargeModelImage(null);
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Reset input immediately to allow same file to be selected again
    if (e.target) {
      e.target.value = "";
    }
    
    // Check file size before reading
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image file is too large. Please use an image smaller than 2MB.");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const newGarment = {
        id: Date.now(),
        name: file.name,
        image: result,
      };
      
      // Check if base64 is too large for localStorage
      const base64Size = (result.length * 3) / 4;
      if (base64Size > 1 * 1024 * 1024) {
        // Store image in memory only
        const newLargeImages = new Map(largeGarmentImages);
        newLargeImages.set(newGarment.id, result);
        setLargeGarmentImages(newLargeImages);
        // Add garment without image for localStorage
        addGarment({ ...newGarment, image: '' });
        toast.success("Garment added (image too large to save)");
      } else {
        // Small enough to persist
        addGarment(newGarment);
        toast.success("Garment added from gallery!");
      }
    };
    reader.onerror = () => {
      toast.error("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  // Get the actual image (from store or memory)
  const getModelImage = () => {
    return largeModelImage || modelImage;
  };

  // Get garment image (from store or memory)
  const getGarmentImage = (garment: any) => {
    if (!garment) return null;
    const largeImage = largeGarmentImages.get(garment.id);
    return largeImage || garment.image || null;
  };

  const lastGarment =
    garments && garments.length > 0 ? garments[garments.length - 1] : null;

  const handleCreateTryOn = () => {
    const currentModelImage = getModelImage();
    if (!currentModelImage) {
      toast.error("Please upload your photo first");
      return;
    }

    if (tab === "single") {
      if (!lastGarment) {
        toast.error("Please select a garment");
        return;
      }
      setSelectedGarmentForTryOn(lastGarment);
      setShowTryOnModal(true);
    } else {
      if (garments.length === 0) {
        toast.error("Please select at least one garment");
        return;
      }
      setSelectedGarmentForTryOn(garments[0]);
      setShowTryOnModal(true);
    }
  };

  const handleTryOnSuccess = (resultUrl: string) => {
    // Save to localStorage (these are small strings, safe to store)
    try {
      localStorage.setItem("tryonResult", resultUrl);
      localStorage.setItem(
        "tryonGarmentName",
        selectedGarmentForTryOn?.name || ""
      );
      // Save buyLink if available
      if (selectedGarmentForTryOn?.buyLink) {
        localStorage.setItem("tryonBuyLink", selectedGarmentForTryOn.buyLink);
      }
      // Only save product image if it's a URL (not base64) or small base64
      const productImage = getGarmentImage(selectedGarmentForTryOn) || selectedGarmentForTryOn?.image;
      if (productImage) {
        // Check if it's a URL or small base64
        if (!productImage.startsWith('data:') || (productImage.length * 3) / 4 < 500 * 1024) {
          localStorage.setItem("tryonProductImage", productImage);
        } else {
          // Skip large base64 images
          console.warn("Product image too large, not saving to localStorage");
        }
      }
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      // Continue anyway - the result URL is the most important
    }
    // Close modal and redirect immediately without any delay
    setShowTryOnModal(false);
    router.replace("/main/tryonresult");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-6 pb-24">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Try On Clothing
        </h2>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="single">Single Garment</TabsTrigger>
            <TabsTrigger value="multiple">Multiple Garments</TabsTrigger>
          </TabsList>

          {/* ---------- SINGLE GARMENT ---------- */}
          <TabsContent value="single">
            <Card
              className="border-dashed border-2 border-gray-300 rounded-lg mb-4 hover:bg-gray-50 cursor-pointer relative"
              onClick={!lastGarment ? handleAddGarment : undefined}
            >
              {/* 🖼️ Gallery Icon (top-left) */}
              <button
                type="button"
                className="absolute top-2 left-2 bg-white/80 p-1 rounded-full shadow hover:bg-gray-100 z-[100]"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation(); // ✅ stop navigation
                  const input = document.getElementById(
                    "galleryUploadSingle"
                  ) as HTMLInputElement | null;
                  input?.click();
                }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <ImageIcon className="h-4 w-4 text-gray-600" />
              </button>

              <input
                type="file"
                id="galleryUploadSingle"
                accept="image/*"
                className="hidden"
                onChange={handleGalleryUpload}
              />

              <CardContent className="flex flex-col items-center justify-center py-10 mt-5">
                {lastGarment ? (
                  <>
                    <div className="relative w-40 h-40 mb-2 rounded-lg overflow-hidden mt-5">
                      <Image
                        src={getGarmentImage(lastGarment) || lastGarment.image || ''}
                        alt={lastGarment.name}
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>

                    <div className="absolute top-2 right-2 flex gap-2 bg-white/70 rounded-md p-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewImage(getGarmentImage(lastGarment) || lastGarment.image || '');
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteGarment(garments.length - 1);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Trash2 className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-400 mt-2" />
                    <p className="text-gray-500 text-sm">Add garment</p>
                    <p className="text-xs text-gray-400 mt-1 text-center">
                      JPEG/PNG/WEBP up to 20MB and 4096×4096 pixels
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Select Model */}
            <Card
              className="border-dashed border-2 border-gray-300 rounded-lg mb-6 hover:bg-gray-50 cursor-pointer relative"
              onClick={() => modelInputRef.current?.click()}
            >
              <CardContent className="flex flex-col items-center justify-center py-10 relative mt-5">
                {getModelImage() ? (
                  <div className="relative w-40 h-40 mb-2 overflow-hidden mt-5">
                    <Image
                      src={getModelImage()!}
                      alt="Model"
                      fill
                      className="object-contain"
                    />
                    <button
                      onClick={handleRemoveModel}
                      className="absolute top-2 right-2 bg-white p-1 rounded-full hover:bg-gray-200"
                    >
                      <Trash2 className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-400 mt-2" />
                    <p className="text-gray-500 text-sm">Upload photo</p>
                  </>
                )}
              </CardContent>
            </Card>

            <Button
              onClick={handleCreateTryOn}
              disabled={!getModelImage() || !lastGarment}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Create Virtual Try-On
            </Button>
          </TabsContent>

          {/* ---------- MULTIPLE GARMENTS ---------- */}
          <TabsContent value="multiple">
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[0, 1, 2].map((index) => {
                const item = garments[index];
                return item ? (
                  <Card
                    key={`garment-${item.id || index}`}
                    className="border-dashed border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer relative"
                  >
                    <CardContent className="flex flex-col items-center justify-center py-10 relative mt-5">
                      <div className="relative w-25 h-20 mb-2 rounded-md overflow-hidden mt-5">
                        <Image
                          src={getGarmentImage(item) || item.image || ''}
                          alt={item.name}
                          fill
                          className="object-contain"
                        />
                      </div>

                      <div className="absolute top-2 right-2 flex gap-1 bg-white/70 rounded-md p-1">
                        <button
                          onClick={() => setPreviewImage(getGarmentImage(item) || item.image || '')}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Eye className="h-3 w-3 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteGarment(index)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Trash2 className="h-3 w-3 text-gray-600" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card
                    key={`empty-${index}`}
                    onClick={handleAddGarment}
                    className="border-dashed border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer relative"
                  >
                    {/* 🖼️ Gallery Icon (top-left) */}
                    <button
                      type="button"
                      className="absolute top-2 left-2 bg-white/80 p-1 rounded-full shadow hover:bg-gray-100 z-[100]"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation(); // ✅ stop redirect
                        const input = document.getElementById(
                          `galleryUploadMultiple-${index}`
                        ) as HTMLInputElement | null;
                        input?.click();
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <ImageIcon className="h-4 w-4 text-gray-600" />
                    </button>

                    <input
                      type="file"
                      id={`galleryUploadMultiple-${index}`}
                      accept="image/*"
                      className="hidden"
                      onChange={handleGalleryUpload}
                    />

                    <CardContent className="flex flex-col items-center justify-center py-10 mt-5">
                      <Upload className="h-8 w-8 text-gray-400 mt-2" />
                      <p className="text-gray-500 text-sm text-center">
                        Add garment
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Select Model */}
            <Card
              className="border-dashed border-2 border-gray-300 rounded-lg mb-6 hover:bg-gray-50 cursor-pointer relative "
              onClick={() => modelInputRef.current?.click()}
            >
              <CardContent className="flex flex-col items-center justify-center py-10 relative">
                {getModelImage() ? (
                  <div className="relative w-40 h-48 mb-2 overflow-hidden mt-5">
                    <Image
                      src={getModelImage()!}
                      alt="Model"
                      fill
                      className="object-contain"
                    />
                    <button
                      onClick={handleRemoveModel}
                      className="absolute top-2 right-2 bg-white p-1 rounded-full hover:bg-gray-200"
                    >
                      <Trash2 className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-400 mt-2" />
                    <p className="text-gray-500 text-sm">Upload photo</p>
                  </>
                )}
              </CardContent>
            </Card>

            <Button
              onClick={handleCreateTryOn}
              disabled={!getModelImage() || garments.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Create Virtual Try-On
            </Button>
          </TabsContent>
        </Tabs>
      </div>

      {/* Try-On Modal */}
      {showTryOnModal && selectedGarmentForTryOn && getModelImage() && (
        <TryOnModal
          isOpen={showTryOnModal}
          onClose={() => setShowTryOnModal(false)}
          humanImage={getModelImage()!}
          garmentImage={getGarmentImage(selectedGarmentForTryOn) || selectedGarmentForTryOn.image}
          garmentName={selectedGarmentForTryOn.name}
          onSuccess={handleTryOnSuccess}
        />
      )}

      <input
        ref={modelInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleModelUpload}
      />

      {previewImage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2">
          <div className="relative bg-white rounded-lg p-4 max-w-lg w-full">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 p-2 rounded-full bg-white hover:bg-gray-200 z-50"
            >
              <X className="h-5 w-5 text-gray-800" />
            </button>

            <div className="relative w-full h-96 z-10">
              <Image
                src={previewImage}
                alt="Preview"
                fill
                className="object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TryOnPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      }
    >
      <TryOnPageContent />
    </Suspense>
  );
}
