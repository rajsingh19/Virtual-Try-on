"use client";

import React, { useCallback } from 'react';
import { VizzleAPI, type TransformResponse, type VideoResponse } from '@/lib/api/vizzle-api';
import { useUploadStore } from '@/app/store/uploadStore';
import { useTryOnStore } from '@/app/store/tryonStore';

/**
 * Hook for uploading human/person image
 */
export function useUploadHuman() {
  const {
    humanUploading,
    humanError,
    humanUploadedImage,
    setHumanUploading,
    setHumanError,
    setHumanUploadedImage,
    resetHuman,
  } = useUploadStore();

  const upload = useCallback(async (file: File) => {
    // Clear any previous state to prevent cache issues
    setHumanError(null);
    setHumanUploading(true);
    
    try {
      // Create a fresh file reference to avoid cache issues
      const fileBlob = file instanceof Blob ? file : new Blob([file], { type: file.type });
      const freshFile = new File([fileBlob], file.name, { 
        type: file.type,
        lastModified: Date.now() 
      });
      
      const response = await VizzleAPI.uploadHumanImage(freshFile);
      setHumanUploadedImage({ url: response.url, publicId: response.public_id });
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
      setHumanError(errorMessage);
      // Clear uploaded image on error to prevent stale state
      setHumanUploadedImage(null);
      throw err;
    } finally {
      setHumanUploading(false);
    }
  }, [setHumanUploading, setHumanError, setHumanUploadedImage]);

  const reset = useCallback(() => {
    resetHuman();
  }, [resetHuman]);

  return { 
    upload, 
    uploading: humanUploading, 
    error: humanError, 
    uploadedImage: humanUploadedImage, 
    reset 
  };
}

/**
 * Hook for uploading garment/clothing image
 */
export function useUploadGarment() {
  const {
    garmentUploading,
    garmentError,
    garmentUploadedImage,
    setGarmentUploading,
    setGarmentError,
    setGarmentUploadedImage,
    resetGarment,
  } = useUploadStore();

  const upload = useCallback(async (file: File) => {
    // Clear any previous state to prevent cache issues
    setGarmentError(null);
    setGarmentUploading(true);
    
    try {
      // Create a fresh file reference to avoid cache issues
      const fileBlob = file instanceof Blob ? file : new Blob([file], { type: file.type });
      const freshFile = new File([fileBlob], file.name, { 
        type: file.type,
        lastModified: Date.now() 
      });
      
      const response = await VizzleAPI.uploadGarmentImage(freshFile);
      setGarmentUploadedImage({ url: response.url, publicId: response.public_id });
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
      setGarmentError(errorMessage);
      // Clear uploaded image on error to prevent stale state
      setGarmentUploadedImage(null);
      throw err;
    } finally {
      setGarmentUploading(false);
    }
  }, [setGarmentUploading, setGarmentError, setGarmentUploadedImage]);

  const reset = useCallback(() => {
    resetGarment();
  }, [resetGarment]);

  return { 
    upload, 
    uploading: garmentUploading, 
    error: garmentError, 
    uploadedImage: garmentUploadedImage, 
    reset 
  };
}

/**
 * Hook for performing virtual try-on
 */
export function useVirtualTryOn() {
  const {
    processing,
    polling,
    error,
    result,
    resultImageUrl,
    setProcessing,
    setPolling,
    setError,
    setResult,
    setResultImageUrl,
    resetTryOn,
  } = useTryOnStore();

  const performTryOn = useCallback(async (humanImg: string, garmImg: string, options?: {
    garmentType?: string;
    useVision?: boolean;
    params?: any;
  }) => {
    setProcessing(true);
    setError(null);
    try {
      const response = await VizzleAPI.performVirtualTryOn({
        human_img: humanImg,
        garm_img: garmImg,
        garment_type: (options?.garmentType as any) || 'auto_detect',
        use_vision: options?.useVision ?? true,
        params: options?.params,
      });
      setResult(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to perform try-on';
      setError(errorMessage);
      throw err;
    } finally {
      setProcessing(false);
    }
  }, [setProcessing, setError, setResult]);

  const checkStatus = useCallback(async (predictionId: string) => {
    try {
      const response = await VizzleAPI.getVirtualTryOnStatus(predictionId);
      setResult(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check status';
      setError(errorMessage);
      throw err;
    }
  }, [setError, setResult]);

  const waitForCompletion = useCallback(async (predictionId: string) => {
    setPolling(true);
    try {
      const response = await VizzleAPI.waitForVirtualTryOn(predictionId);
      setResult(response);
      // Extract image URL from result
      if (response.status === "succeeded" && response.output) {
        const outputUrl = Array.isArray(response.output) ? response.output[0] : response.output;
        setResultImageUrl(outputUrl as string);
      }
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to wait for completion';
      setError(errorMessage);
      throw err;
    } finally {
      setPolling(false);
    }
  }, [setPolling, setError, setResult, setResultImageUrl]);

  const reset = useCallback(() => {
    resetTryOn();
  }, [resetTryOn]);

  return { performTryOn, checkStatus, waitForCompletion, processing, polling, error, result, resultImageUrl, reset };
}

/**
 * Hook for performing layered try-on
 */
export function useLayeredTryOn() {
  const {
    layeredProcessing,
    layeredPolling,
    layeredError,
    layeredResult,
    resultImageUrl,
    setLayeredProcessing,
    setLayeredPolling,
    setLayeredError,
    setLayeredResult,
    setResultImageUrl,
    resetLayered,
  } = useTryOnStore();

  const performLayeredTryOn = useCallback(async (
    resultImg: string,
    garmImg: string,
    garmentType: string,
    options?: {
      useVision?: boolean;
      params?: any;
    }
  ) => {
    setLayeredProcessing(true);
    setLayeredError(null);
    try {
      const response = await VizzleAPI.performLayeredTryOn({
        result_img: resultImg,
        garm_img: garmImg,
        garment_type: garmentType as any,
        use_vision: options?.useVision ?? false,
        params: options?.params,
      });
      setLayeredResult(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to perform layered try-on';
      setLayeredError(errorMessage);
      throw err;
    } finally {
      setLayeredProcessing(false);
    }
  }, [setLayeredProcessing, setLayeredError, setLayeredResult]);

  const checkStatus = useCallback(async (predictionId: string) => {
    try {
      const response = await VizzleAPI.getLayeredTryOnStatus(predictionId);
      setLayeredResult(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check status';
      setLayeredError(errorMessage);
      throw err;
    }
  }, [setLayeredError, setLayeredResult]);

  const waitForCompletion = useCallback(async (predictionId: string) => {
    setLayeredPolling(true);
    try {
      const response = await VizzleAPI.waitForLayeredTryOn(predictionId);
      setLayeredResult(response);
      // Extract image URL from result
      if (response.status === "succeeded" && response.output) {
        const outputUrl = Array.isArray(response.output) ? response.output[0] : response.output;
        setResultImageUrl(outputUrl as string);
      }
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to wait for completion';
      setLayeredError(errorMessage);
      throw err;
    } finally {
      setLayeredPolling(false);
    }
  }, [setLayeredPolling, setLayeredError, setLayeredResult, setResultImageUrl]);

  const reset = useCallback(() => {
    resetLayered();
  }, [resetLayered]);

  return { 
    performLayeredTryOn, 
    checkStatus, 
    waitForCompletion, 
    processing: layeredProcessing, 
    polling: layeredPolling, 
    error: layeredError, 
    result: layeredResult, 
    reset 
  };
}

/**
 * Hook for generating videos
 */
export function useVideoGeneration() {
  const {
    videoProcessing,
    videoPolling,
    videoError,
    videoResult,
    setVideoProcessing,
    setVideoPolling,
    setVideoError,
    setVideoResult,
    resetVideo,
  } = useTryOnStore();

  const generateVideo = useCallback(async (
    imageUrl: string,
    options?: {
      motionType?: string;
      duration?: number;
      fps?: number;
    }
  ) => {
    setVideoProcessing(true);
    setVideoError(null);
    try {
      const response = await VizzleAPI.generateVideo({
        image_url: imageUrl,
        motion_type: options?.motionType || 'subtle_walk',
        duration: options?.duration || 3,
        fps: options?.fps || 24,
      });
      setVideoResult(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate video';
      setVideoError(errorMessage);
      throw err;
    } finally {
      setVideoProcessing(false);
    }
  }, [setVideoProcessing, setVideoError, setVideoResult]);

  const checkStatus = useCallback(async (predictionId: string) => {
    try {
      const response = await VizzleAPI.getVideoStatus(predictionId);
      setVideoResult(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check status';
      setVideoError(errorMessage);
      throw err;
    }
  }, [setVideoError, setVideoResult]);

  const waitForCompletion = useCallback(async (predictionId: string) => {
    setVideoPolling(true);
    try {
      const response = await VizzleAPI.waitForVideo(predictionId);
      setVideoResult(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to wait for completion';
      setVideoError(errorMessage);
      throw err;
    } finally {
      setVideoPolling(false);
    }
  }, [setVideoPolling, setVideoError, setVideoResult]);

  const reset = useCallback(() => {
    resetVideo();
  }, [resetVideo]);

  return { 
    generateVideo, 
    checkStatus, 
    waitForCompletion, 
    processing: videoProcessing, 
    polling: videoPolling, 
    error: videoError, 
    result: videoResult, 
    reset 
  };
}

/**
 * Hook for checking garment safety
 */
export function useGarmentSafety() {
  // Keep local state for this as it's not critical for persistence
  const [checking, setChecking] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{ allowed: boolean; message: string } | null>(null);

  const checkSafety = useCallback(async (garmentDescription: string) => {
    setChecking(true);
    setError(null);
    try {
      const response = await VizzleAPI.checkGarmentSafety(garmentDescription);
      setResult(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check garment safety';
      setError(errorMessage);
      throw err;
    } finally {
      setChecking(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { checkSafety, checking, error, result, reset };
}

