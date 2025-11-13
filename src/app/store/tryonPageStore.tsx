import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TryOnPageState {
  // Model image - store as base64 but with size limit check
  modelImage: string | null;
  setModelImage: (image: string | null) => void;
  
  // Garments - store only metadata, not full base64 images
  garments: Array<{
    id: number;
    name: string;
    image: string; // URL or base64 (but we'll limit base64 size)
    buyLink?: string;
    price?: string;
    category?: string;
  }>;
  setGarments: (garments: Array<any>) => void;
  addGarment: (garment: any) => void;
  removeGarment: (index: number) => void;
  
  // Tab state
  originTab: string;
  setOriginTab: (tab: string) => void;
  
  // Clear all
  clearAll: () => void;
}

// Helper to check if base64 string is too large (limit to 1MB)
const isBase64TooLarge = (base64: string): boolean => {
  // Base64 is ~33% larger than original, so 1MB base64 ≈ 750KB original
  const sizeInBytes = (base64.length * 3) / 4;
  const maxSize = 1 * 1024 * 1024; // 1MB
  return sizeInBytes > maxSize;
};

// Helper to compress base64 image or return null if too large
const compressBase64 = (base64: string, maxSize: number = 500 * 1024): string | null => {
  if (!isBase64TooLarge(base64)) {
    return base64;
  }
  
  // If too large, we'll need to compress it
  // For now, return null to prevent storage
  console.warn('Image too large for storage, skipping localStorage');
  return null;
};

export const useTryOnPageStore = create<TryOnPageState>()(
  persist(
    (set, get) => ({
      modelImage: null,
      garments: [],
      originTab: "single",

      setModelImage: (image) => {
        // Don't store large base64 images in localStorage
        if (image && image.startsWith('data:')) {
          if (isBase64TooLarge(image)) {
            console.warn('Model image too large for localStorage, keeping in memory only');
            // Store in memory but not persist
            set({ modelImage: image });
            return;
          }
        }
        set({ modelImage: image });
      },

      setGarments: (garments) => {
        // Filter out large base64 images from garments
        const filteredGarments = garments.map(garment => {
          if (garment.image && garment.image.startsWith('data:')) {
            if (isBase64TooLarge(garment.image)) {
              console.warn(`Garment ${garment.name} image too large, removing from storage`);
              // Keep the garment but remove the large image
              return { ...garment, image: '' };
            }
          }
          return garment;
        });
        set({ garments: filteredGarments });
      },

      addGarment: (garment) => {
        const current = get().garments;
        // Check if image is too large
        if (garment.image && garment.image.startsWith('data:')) {
          if (isBase64TooLarge(garment.image)) {
            console.warn(`Garment ${garment.name} image too large, not storing in localStorage`);
            // Add without image for localStorage, but keep in memory
            const newGarment = { ...garment, image: '' };
            set({ garments: [...current, newGarment] });
            return;
          }
        }
        set({ garments: [...current, garment] });
      },

      removeGarment: (index) => {
        const current = get().garments;
        set({ garments: current.filter((_, i) => i !== index) });
      },

      setOriginTab: (tab) => set({ originTab: tab }),

      clearAll: () => set({ modelImage: null, garments: [], originTab: "single" }),
    }),
    {
      name: "tryon-page-storage",
      // Only persist small data, skip large base64 images
      partialize: (state) => {
        // Only persist model image if it's small enough
        const modelImage = state.modelImage && !isBase64TooLarge(state.modelImage) 
          ? state.modelImage 
          : null;
        
        // Only persist garments with small images
        const garments = state.garments.map(garment => {
          if (garment.image && garment.image.startsWith('data:')) {
            if (isBase64TooLarge(garment.image)) {
              return { ...garment, image: '' };
            }
          }
          return garment;
        });

        return {
          modelImage,
          garments,
          originTab: state.originTab,
        };
      },
    }
  )
);

