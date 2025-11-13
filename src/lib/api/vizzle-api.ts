/**
 * Vizzle Virtual Try-On API Service
 * Type-safe API methods for all endpoints
 */

import { apiClient, handleApiError } from './client';
import type {
  GarmentCategory,
  GarmentType,
  ImageUploadResponse,
  TransformResponse,
  VideoResponse,
  VirtualTryOnRequest,
  LayeredTryOnRequest,
  VideoGenerationRequest,
  IDMVTONParams,
  HealthResponse,
  GarmentSafetyResponse,
} from '@/types/api-types';

// Re-export types for convenience
export type {
  GarmentCategory,
  GarmentType,
  ImageUploadResponse,
  TransformResponse,
  VideoResponse,
  VirtualTryOnRequest,
  LayeredTryOnRequest,
  VideoGenerationRequest,
  IDMVTONParams,
};

/**
 * Health Check
 */
export async function checkHealth(): Promise<HealthResponse> {
  try {
    const { data, error } = await apiClient.GET<HealthResponse>('/health');
    if (error) throw new Error(handleApiError(error));
    return data as HealthResponse;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Upload Human/Person Image
 */
export async function uploadHumanImage(file: File): Promise<ImageUploadResponse> {
  try {
    // Create fresh FormData with unique filename to prevent cache issues
    const formData = new FormData();
    const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}_${file.name}`;
    const fileBlob = new Blob([file], { type: file.type });
    const uniqueFile = new File([fileBlob], uniqueFileName, { type: file.type });
    formData.append('file', uniqueFile);

    // Add cache-busting query parameter
    const cacheBuster = `?t=${Date.now()}&r=${Math.random()}`;
    const uploadUrl = `${apiClient.baseUrl}/api/upload/human/${cacheBuster}`;
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
      cache: 'no-store',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to upload human image');
    }

    return await response.json();
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Upload Garment/Clothing Image
 */
export async function uploadGarmentImage(file: File): Promise<ImageUploadResponse> {
  try {
    // Create fresh FormData with unique filename to prevent cache issues
    const formData = new FormData();
    const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}_${file.name}`;
    const fileBlob = new Blob([file], { type: file.type });
    const uniqueFile = new File([fileBlob], uniqueFileName, { type: file.type });
    formData.append('file', uniqueFile);

    // Add cache-busting query parameter
    const cacheBuster = `?t=${Date.now()}&r=${Math.random()}`;
    const uploadUrl = `${apiClient.baseUrl}/api/upload/tryonitem/${cacheBuster}`;
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
      cache: 'no-store',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to upload garment image');
    }

    return await response.json();
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Perform Virtual Try-On
 */
export async function performVirtualTryOn(
  request: VirtualTryOnRequest
): Promise<TransformResponse> {
  try {
    const { data, error } = await apiClient.POST<TransformResponse>('/api/virtual-try-on/', {
      body: request,
    });

    if (error) throw new Error(handleApiError(error));
    return data as TransformResponse;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Get Virtual Try-On Status
 */
export async function getVirtualTryOnStatus(
  predictionId: string
): Promise<TransformResponse> {
  try {
    const { data, error } = await apiClient.GET<TransformResponse>(
      '/api/virtual-try-on/status/{prediction_id}',
      {
        params: {
          path: { prediction_id: predictionId },
        },
      }
    );

    if (error) throw new Error(handleApiError(error));
    return data as TransformResponse;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Wait for Virtual Try-On Completion
 */
export async function waitForVirtualTryOn(
  predictionId: string
): Promise<TransformResponse> {
  try {
    const { data, error } = await apiClient.GET<TransformResponse>(
      '/api/virtual-try-on/wait/{prediction_id}',
      {
        params: {
          path: { prediction_id: predictionId },
        },
      }
    );

    if (error) throw new Error(handleApiError(error));
    return data as TransformResponse;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Perform Layered Try-On (add more clothing to existing result)
 */
export async function performLayeredTryOn(
  request: LayeredTryOnRequest
): Promise<TransformResponse> {
  try {
    const { data, error } = await apiClient.POST<TransformResponse>('/api/layered-try-on/', {
      body: request,
    });

    if (error) throw new Error(handleApiError(error));
    return data as TransformResponse;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Get Layered Try-On Status
 */
export async function getLayeredTryOnStatus(
  predictionId: string
): Promise<TransformResponse> {
  try {
    const { data, error } = await apiClient.GET<TransformResponse>(
      '/api/layered-try-on/status/{prediction_id}',
      {
        params: {
          path: { prediction_id: predictionId },
        },
      }
    );

    if (error) throw new Error(handleApiError(error));
    return data as TransformResponse;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Wait for Layered Try-On Completion
 */
export async function waitForLayeredTryOn(
  predictionId: string
): Promise<TransformResponse> {
  try {
    const { data, error } = await apiClient.GET<TransformResponse>(
      '/api/layered-try-on/wait/{prediction_id}',
      {
        params: {
          path: { prediction_id: predictionId },
        },
      }
    );

    if (error) throw new Error(handleApiError(error));
    return data as TransformResponse;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Generate Video from Try-On Result
 */
export async function generateVideo(
  request: VideoGenerationRequest
): Promise<VideoResponse> {
  try {
    const { data, error } = await apiClient.POST<VideoResponse>('/api/generate-video/', {
      body: request,
    });

    if (error) throw new Error(handleApiError(error));
    return data as VideoResponse;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Get Video Generation Status
 */
export async function getVideoStatus(predictionId: string): Promise<VideoResponse> {
  try {
    const { data, error } = await apiClient.GET<VideoResponse>(
      '/api/generate-video/status/{prediction_id}',
      {
        params: {
          path: { prediction_id: predictionId },
        },
      }
    );

    if (error) throw new Error(handleApiError(error));
    return data as VideoResponse;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Wait for Video Generation Completion
 */
export async function waitForVideo(predictionId: string): Promise<VideoResponse> {
  try {
    const { data, error } = await apiClient.GET<VideoResponse>(
      '/api/generate-video/wait/{prediction_id}',
      {
        params: {
          path: { prediction_id: predictionId },
        },
      }
    );

    if (error) throw new Error(handleApiError(error));
    return data as VideoResponse;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Check if Garment Type is Allowed
 */
export async function checkGarmentSafety(
  garmentDescription: string
): Promise<GarmentSafetyResponse> {
  try {
    const { data, error } = await apiClient.GET<GarmentSafetyResponse>('/api/check-garment-safety/', {
      params: {
        query: { garment_description: garmentDescription },
      },
    });

    if (error) throw new Error(handleApiError(error));
    return data as GarmentSafetyResponse;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

// Export all API methods as a single object
export const VizzleAPI = {
  checkHealth,
  uploadHumanImage,
  uploadGarmentImage,
  performVirtualTryOn,
  getVirtualTryOnStatus,
  waitForVirtualTryOn,
  performLayeredTryOn,
  getLayeredTryOnStatus,
  waitForLayeredTryOn,
  generateVideo,
  getVideoStatus,
  waitForVideo,
  checkGarmentSafety,
};
