import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TransformResponse, VideoResponse } from "@/lib/api/vizzle-api";

interface TryOnState {
  // Virtual try-on state
  processing: boolean;
  polling: boolean;
  error: string | null;
  result: TransformResponse | null;
  resultImageUrl: string | null;

  // Layered try-on state
  layeredProcessing: boolean;
  layeredPolling: boolean;
  layeredError: string | null;
  layeredResult: TransformResponse | null;

  // Video generation state
  videoProcessing: boolean;
  videoPolling: boolean;
  videoError: string | null;
  videoResult: VideoResponse | null;

  // Actions for virtual try-on
  setProcessing: (processing: boolean) => void;
  setPolling: (polling: boolean) => void;
  setError: (error: string | null) => void;
  setResult: (result: TransformResponse | null) => void;
  setResultImageUrl: (url: string | null) => void;

  // Actions for layered try-on
  setLayeredProcessing: (processing: boolean) => void;
  setLayeredPolling: (polling: boolean) => void;
  setLayeredError: (error: string | null) => void;
  setLayeredResult: (result: TransformResponse | null) => void;

  // Actions for video generation
  setVideoProcessing: (processing: boolean) => void;
  setVideoPolling: (polling: boolean) => void;
  setVideoError: (error: string | null) => void;
  setVideoResult: (result: VideoResponse | null) => void;

  // Reset functions
  resetTryOn: () => void;
  resetLayered: () => void;
  resetVideo: () => void;
  resetAll: () => void;
}

export const useTryOnStore = create<TryOnState>()(
  persist(
    (set) => ({
      // Initial state
      processing: false,
      polling: false,
      error: null,
      result: null,
      resultImageUrl: null,

      layeredProcessing: false,
      layeredPolling: false,
      layeredError: null,
      layeredResult: null,

      videoProcessing: false,
      videoPolling: false,
      videoError: null,
      videoResult: null,

      // Virtual try-on actions
      setProcessing: (processing) => set({ processing }),
      setPolling: (polling) => set({ polling }),
      setError: (error) => set({ error }),
      setResult: (result) => set({ result }),
      setResultImageUrl: (url) => set({ resultImageUrl: url }),

      // Layered try-on actions
      setLayeredProcessing: (processing) => set({ layeredProcessing: processing }),
      setLayeredPolling: (polling) => set({ layeredPolling: polling }),
      setLayeredError: (error) => set({ layeredError: error }),
      setLayeredResult: (result) => set({ layeredResult: result }),

      // Video generation actions
      setVideoProcessing: (processing) => set({ videoProcessing: processing }),
      setVideoPolling: (polling) => set({ videoPolling: polling }),
      setVideoError: (error) => set({ videoError: error }),
      setVideoResult: (result) => set({ videoResult: result }),

      // Reset functions
      resetTryOn: () =>
        set({
          processing: false,
          polling: false,
          error: null,
          result: null,
          resultImageUrl: null,
        }),
      resetLayered: () =>
        set({
          layeredProcessing: false,
          layeredPolling: false,
          layeredError: null,
          layeredResult: null,
        }),
      resetVideo: () =>
        set({
          videoProcessing: false,
          videoPolling: false,
          videoError: null,
          videoResult: null,
        }),
      resetAll: () =>
        set({
          processing: false,
          polling: false,
          error: null,
          result: null,
          resultImageUrl: null,
          layeredProcessing: false,
          layeredPolling: false,
          layeredError: null,
          layeredResult: null,
          videoProcessing: false,
          videoPolling: false,
          videoError: null,
          videoResult: null,
        }),
    }),
    {
      name: "tryon-storage",
      // Only persist results, not loading states
      partialize: (state) => ({
        result: state.result,
        resultImageUrl: state.resultImageUrl,
        layeredResult: state.layeredResult,
        videoResult: state.videoResult,
      }),
    }
  )
);

