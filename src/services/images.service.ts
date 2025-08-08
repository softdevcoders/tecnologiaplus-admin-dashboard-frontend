import type { ApiResponse } from '@/libs/http'
import httpClient from '@/libs/http'

export interface UploadImageResponse {
  url: string
  publicId: string
  tempImageId: string
}

export interface UploadImageRequest {
  file: File
  sessionId: string
  type: 'cover' | 'content'
}

class ImagesService {
  private baseUrl = '/images'

  /**
   * Subir imagen principal del artículo
   */
  async uploadCoverImage(file: File, sessionId: string): Promise<ApiResponse<UploadImageResponse>> {
    const formData = new FormData()

    formData.append('file', file)
    formData.append('sessionId', sessionId)

    return httpClient.post<UploadImageResponse>(`${this.baseUrl}/upload/cover`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  /**
   * Subir imagen de contenido del artículo
   */
  async uploadContentImage(file: File, sessionId: string): Promise<ApiResponse<UploadImageResponse>> {
    const formData = new FormData()

    formData.append('file', file)
    formData.append('sessionId', sessionId)

    return httpClient.post<UploadImageResponse>(`${this.baseUrl}/upload/content`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  /**
   * Eliminar imagen temporal
   */
  async deleteTempImage(tempImageId: string): Promise<ApiResponse<{ message: string }>> {
    return httpClient.delete<{ message: string }>(`${this.baseUrl}/temp/${tempImageId}`)
  }

  /**
   * Limpiar imágenes temporales de una sesión
   */
  async cleanupSessionImages(sessionId: string): Promise<ApiResponse<{ message: string; deletedCount: number }>> {
    return httpClient.delete<{ message: string; deletedCount: number }>(`${this.baseUrl}/cleanup/${sessionId}`)
  }

  /**
   * Mover imágenes temporales a ubicación final del artículo
   */
  async moveImagesToArticle(
    tempImageIds: string[],
    categorySlug: string,
    articleSlug: string
  ): Promise<ApiResponse<{ movedImages: Array<{ tempImageId: string; newUrl: string; newPublicId: string }> }>> {
    return httpClient.post<{ movedImages: Array<{ tempImageId: string; newUrl: string; newPublicId: string }> }>(
      `${this.baseUrl}/move-to-article`,
      {
        tempImageIds,
        categorySlug,
        articleSlug
      }
    )
  }

  /**
   * Validar archivo antes de subir
   */
  validateFile(file: File): { isValid: boolean; error?: string } {
    // Validar tamaño (8MB)
    const maxSize = 8 * 1024 * 1024 // 8MB

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'El archivo es demasiado grande. Máximo 8MB'
      }
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/tiff']

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Tipo de archivo no permitido. Solo se permiten imágenes (JPG, PNG, WebP, GIF, SVG, TIFF)'
      }
    }

    return { isValid: true }
  }
}

export const imagesService = new ImagesService()
