"use client";

import Image from "next/image";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useWishlistStore } from "../store/wishlistStore";
import { useRouter, useSearchParams } from "next/navigation";

interface Product {
  id: number;
  name: string;
  image: string;
  category: string;
}

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { wishlist, toggleWishlist } = useWishlistStore();

  // ✅ Detect from where user came (dynamic)
  const [originTab, setOriginTab] = useState("single");
  useEffect(() => {
    const tabFromURL = searchParams.get("tab");
    if (tabFromURL === "multiple" || tabFromURL === "single") {
      setOriginTab(tabFromURL);
      // Store it globally
      localStorage.setItem("originTab", tabFromURL);
    } else {
      const saved = localStorage.getItem("originTab");
      if (saved) setOriginTab(saved);
    }
  }, [searchParams]);

  // ✅ Product list
  const products: Product[] = [
    { id: 1, name: "Men Black Shirt", image: "/v3.jpg", category: "Men" },
    { id: 2, name: "Women Grey Jogger", image: "/v2.jpg", category: "Women" },
    { id: 3, name: "Kids Red T-Shirt", image: "/v5.jpg", category: "Kids" },
    { id: 4, name: "Men Formal Coat", image: "/v4.jpg", category: "Men" },
    { id: 5, name: "Women White Dress", image: "/v1.jpg", category: "Women" },
    { id: 6, name: "Kids Blue Shorts", image: "/v6.jpg", category: "Kids" },
  ];

  const categories = ["All", "Men", "Women", "Kids"];

  // ✅ Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // ✅ Handle "Try On" button
  const handleTryOn = (product: Product) => {
    const existing = JSON.parse(localStorage.getItem("tryonProducts") || "[]");
    const alreadyAdded = existing.some((p: Product) => p.id === product.id);
    const updated = alreadyAdded ? existing : [...existing, product];
    localStorage.setItem("tryonProducts", JSON.stringify(updated));

    // 🔹 Save the tab user came from (to return correctly later)
    localStorage.setItem("originTab", originTab);

    // 🔹 Redirect back to TryOn page (same tab)
    router.push(`/main/tryon?tab=${originTab}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-y-auto pb-24 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      {/* Header */}
      <div className="relative w-full h-64">
        <video
          src="/BV.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="object-cover brightness-90 w-full h-full"
        />
        <div className="absolute inset-0 bg-black/20" />

        {/* Search Bar */}
        <div className="absolute top-5 left-0 w-full px-4">
          <div className="flex items-center gap-2 w-full bg-white/80 backdrop-blur-md rounded-full px-4 py-2">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search your style..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedCategory("All");
              }}
              className="bg-transparent outline-none text-sm w-full text-gray-700 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Header Text */}
        <div className="absolute bottom-5 left-5 text-white">
          <h1 className="text-2xl font-semibold">Discover your Style</h1>
          <p className="text-sm opacity-90">Try fashion that fits you best</p>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mt-4">
        <h2 className="text-lg font-semibold mb-3">Categories</h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
          {categories.map((cat) => (
            <div
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center justify-center min-w-[90px] px-4 py-2 rounded-full cursor-pointer transition-all text-sm font-medium ${
                selectedCategory === cat
                  ? "bg-black text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              }`}
            >
              {cat}
            </div>
          ))}
        </div>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-2 gap-4 p-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="flex flex-col items-start">
              <div className="relative bg-[#f4f4f4] w-full h-[300px] rounded-[10px] overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover rounded-[10px]"
                />
              </div>

              {/* Info + Wishlist */}
              <div className="mt-2 flex items-center justify-between w-full">
                <p className="text-[15px] text-gray-800 font-medium truncate">
                  {product.name}
                </p>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="text-gray-600 hover:scale-110 transition-all"
                >
                  {wishlist.includes(product.id) ? (
                    <AiFillHeart className="text-red-500 text-[22px]" />
                  ) : (
                    <AiOutlineHeart className="text-gray-600 text-[22px]" />
                  )}
                </button>
              </div>

              {/* Try On Button */}
              <button
                onClick={() => handleTryOn(product)}
                className="mt-2 w-full bg-black text-white text-sm py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Try On
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-2 text-center text-gray-500 py-10">
            No products found for “{searchTerm || selectedCategory}”
          </p>
        )}
      </div>
    </div>
  );
}
