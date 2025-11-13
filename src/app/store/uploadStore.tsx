import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UploadedImage {
  url: string;
  publicId: string;
}

interface UploadState {
  // Human image upload state
  humanUploading: boolean;
  humanError: string | null;
  humanUploadedImage: UploadedImage | null;
  humanPreview: string | null;

  // Garment image upload state
  garmentUploading: boolean;
  garmentError: string | null;
  garmentUploadedImage: UploadedImage | null;
  garmentPreview: string | null;

  // Actions for human image
  setHumanUploading: (uploading: boolean) => void;
  setHumanError: (error: string | null) => void;
  setHumanUploadedImage: (image: UploadedImage | null) => void;
  setHumanPreview: (preview: string | null) => void;
  resetHuman: () => void;

  // Actions for garment image
  setGarmentUploading: (uploading: boolean) => void;
  setGarmentError: (error: string | null) => void;
  setGarmentUploadedImage: (image: UploadedImage | null) => void;
  setGarmentPreview: (preview: string | null) => void;
  resetGarment: () => void;

  // Reset all
  resetAll: () => void;
}

export const useUploadStore = create<UploadState>()(
  persist(
    (set) => ({
      // Initial state
      humanUploading: false,
      humanError: null,
      humanUploadedImage: null,
      humanPreview: null,

      garmentUploading: false,
      garmentError: null,
      garmentUploadedImage: null,
      garmentPreview: null,

      // Human image actions
      setHumanUploading: (uploading) => set({ humanUploading: uploading }),
      setHumanError: (error) => set({ humanError: error }),
      setHumanUploadedImage: (image) => set({ humanUploadedImage: image }),
      setHumanPreview: (preview) => set({ humanPreview: preview }),
      resetHuman: () =>
        set({
          humanUploading: false,
          humanError: null,
          humanUploadedImage: null,
          humanPreview: null,
        }),

      // Garment image actions
      setGarmentUploading: (uploading) => set({ garmentUploading: uploading }),
      setGarmentError: (error) => set({ garmentError: error }),
      setGarmentUploadedImage: (image) => set({ garmentUploadedImage: image }),
      setGarmentPreview: (preview) => set({ garmentPreview: preview }),
      resetGarment: () =>
        set({
          garmentUploading: false,
          garmentError: null,
          garmentUploadedImage: null,
          garmentPreview: null,
        }),

      // Reset all
      resetAll: () =>
        set({
          humanUploading: false,
          humanError: null,
          humanUploadedImage: null,
          humanPreview: null,
          garmentUploading: false,
          garmentError: null,
          garmentUploadedImage: null,
          garmentPreview: null,
        }),
    }),
    {
      name: "upload-storage",
      // Only persist uploaded images and previews, not loading states
      partialize: (state) => ({
        humanUploadedImage: state.humanUploadedImage,
        humanPreview: state.humanPreview,
        garmentUploadedImage: state.garmentUploadedImage,
        garmentPreview: state.garmentPreview,
      }),
    }
  )
);

