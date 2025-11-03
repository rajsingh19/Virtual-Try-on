"use client";

import React, { useState, useEffect, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Eye, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

export default function TryOnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tab, setTab] = useState("single");
  const [garments, setGarments] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [modelImage, setModelImage] = useState<string | null>(null);

  // shared input ref for both tabs
  const modelInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("tryonProducts") || "[]");
    setGarments(stored);

    const tabFromURL = searchParams.get("tab");
    if (tabFromURL === "multiple" || tabFromURL === "single") {
      setTab(tabFromURL);
      localStorage.setItem("originTab", tabFromURL);
    } else {
      const saved = localStorage.getItem("originTab");
      if (saved) setTab(saved);
    }

    const savedModel = localStorage.getItem("modelImage");
    if (savedModel) setModelImage(savedModel);
  }, [searchParams]);

  const handleAddGarment = () => {
    localStorage.setItem("originTab", tab);
    router.push(`/main?tab=${tab}`);
  };

  const handleDeleteGarment = (index: number) => {
    const updated = garments.filter((_, i) => i !== index);
    setGarments(updated);
    localStorage.setItem("tryonProducts", JSON.stringify(updated));
  };

  const handleModelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setModelImage(result);
        localStorage.setItem("modelImage", result);
      };
      reader.readAsDataURL(file);
      // clear the input so selecting same file later still triggers change
      event.currentTarget.value = "";
    }
  };

  const handleRemoveModel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModelImage(null);
    localStorage.removeItem("modelImage");
  };

  const lastGarment =
    garments && garments.length > 0 ? garments[garments.length - 1] : null;

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
              <CardContent className="flex flex-col items-center justify-center py-10">
                {lastGarment ? (
                  <>
                    <div className="relative w-40 h-40 mb-2 rounded-lg overflow-hidden ">
                      <Image
                        src={lastGarment.image}
                        alt={lastGarment.name}
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>

                    <div className="absolute top-2 right-2 flex gap-2 bg-white/70 rounded-md p-1">
                      <button
                        onClick={() => setPreviewImage(lastGarment.image)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteGarment(garments.length - 1)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Trash2 className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-500 text-sm">Add garment</p>
                    <p className="text-xs text-gray-400 mt-1 text-center">
                      JPEG/PNG/WEBP up to 20MB and 4096×4096 pixels
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Select Model (single tab) */}
            <Card
              className="border-dashed border-2 border-gray-300 rounded-lg mb-6 hover:bg-gray-50 cursor-pointer relative"
              onClick={() => modelInputRef.current?.click()}
            >
              <CardContent className="flex flex-col items-center justify-center py-10 relative">
                {modelImage ? (
                  <div className="relative w-40 h-40 mb-2  overflow-hidden">
                    <Image
                      src={modelImage}
                      alt="Model"
                      fill
                      className="object-contain "
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
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-500 text-sm">Upload photo</p>
                  </>
                )}
              </CardContent>
            </Card>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Create
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
                    <CardContent className="flex flex-col items-center justify-center py-10 relative">
                      <div className="relative w-25 h-20 mb-2 rounded-md overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain"
                        />
                      </div>

                      <div className="absolute top-2 right-2 flex gap-1 bg-white/70 rounded-md p-1">
                        <button
                          onClick={() => setPreviewImage(item.image)}
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
                    className="border-dashed border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-500 text-sm text-center">
                        Add garment
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Select Model (multiple tab) - uses same shared input */}
            <Card
              className="border-dashed border-2 border-gray-300 rounded-lg mb-6 hover:bg-gray-50 cursor-pointer relative"
              onClick={() => modelInputRef.current?.click()}
            >
              <CardContent className="flex flex-col items-center justify-center py-10 relative">
                {modelImage ? (
                  <div className="relative w-40 h-48 mb-2  overflow-hidden">
                    <Image
                      src={modelImage}
                      alt="Model"
                      fill
                      className="object-contain "
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
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-500 text-sm">
                      Upload photo
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Create
            </Button>
          </TabsContent>
        </Tabs>
      </div>

      {/* Single hidden input rendered ONCE and shared by both cards */}
      <input
        ref={modelInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleModelUpload}
      />

      {/* Preview Modal */}
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
