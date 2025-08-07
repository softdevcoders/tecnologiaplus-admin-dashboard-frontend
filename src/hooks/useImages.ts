import { useState, useCallback } from 'react'
import { imagesService, UploadImageResponse } from '@/services/images.service'

interface UseImagesOptions {
  sessionId: string
  onSuccess?: (response: UploadImageResponse) => void
  onError?: (error: string) => void
}

export const useImages = ({ sessionId, onSuccess, onError }: UseImagesOptions) => {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadCoverImage = useCallback(
    async (file: File): Promise<UploadImageResponse | null> => {
      setUploading(true)
      setError(null)

      try {
        // Validar archivo
        const validation = imagesService.validateFile(file)
        if (!validation.isValid) {
          throw new Error(validation.error)
        }

        // Subir imagen
        const response = await imagesService.uploadCoverImage(file, sessionId)
        
        if (response.data) {
          onSuccess?.(response.data)
          return response.data
        } else {
          throw new Error('Error al subir la imagen')
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
        setError(errorMessage)
        onError?.(errorMessage)
        return null
      } finally {
        setUploading(false)
      }
    },
    [sessionId, onSuccess, onError]
  )

  const uploadContentImage = useCallback(
    async (file: File): Promise<UploadImageResponse | null> => {
      setUploading(true)
      setError(null)

      try {
        // Validar archivo
        const validation = imagesService.validateFile(file)
        if (!validation.isValid) {
          throw new Error(validation.error)
        }

        // Subir imagen
        const response = await imagesService.uploadContentImage(file, sessionId)
        
        if (response.data) {
          onSuccess?.(response.data)
          return response.data
        } else {
          throw new Error('Error al subir la imagen')
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
        setError(errorMessage)
        onError?.(errorMessage)
        return null
      } finally {
        setUploading(false)
      }
    },
    [sessionId, onSuccess, onError]
  )

  const deleteTempImage = useCallback(
    async (tempImageId: string): Promise<boolean> => {
      try {
        await imagesService.deleteTempImage(tempImageId)
        return true
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al eliminar la imagen'
        setError(errorMessage)
        onError?.(errorMessage)
        return false
      }
    },
    [onError]
  )

  const cleanupSessionImages = useCallback(
    async (): Promise<boolean> => {
      try {
        const response = await imagesService.cleanupSessionImages(sessionId)
        console.log(`Limpieza completada: ${response.data?.deletedCount} imágenes eliminadas`)
        return true
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al limpiar imágenes'
        setError(errorMessage)
        onError?.(errorMessage)
        return false
      }
    },
    [sessionId, onError]
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    uploading,
    error,
    uploadCoverImage,
    uploadContentImage,
    deleteTempImage,
    cleanupSessionImages,
    clearError,
  }
} 