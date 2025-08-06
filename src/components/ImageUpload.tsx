'use client'

import { useState, useRef, useCallback } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material'

interface ImageUploadProps {
  value?: string
  onChange: (imageUrl: string) => void
  label?: string
  error?: boolean
  helperText?: string
  accept?: string
  maxSize?: number // en MB
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = 'Imagen principal',
  error = false,
  helperText,
  accept = 'image/*',
  maxSize = 5, // 5MB por defecto
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFile(files[0])
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }, [])

  const handleFile = useCallback(async (file: File) => {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setUploadError('Solo se permiten archivos de imagen')
      return
    }

    // Validar tamaño
    if (file.size > maxSize * 1024 * 1024) {
      setUploadError(`El archivo es demasiado grande. Máximo ${maxSize}MB`)
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      // Por ahora, convertimos a base64 para simular una subida
      // En producción, aquí subirías a un servidor de archivos
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        onChange(result)
        setIsUploading(false)
      }
      reader.onerror = () => {
        setUploadError('Error al leer el archivo')
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      setUploadError('Error al procesar la imagen')
      setIsUploading(false)
    }
  }, [maxSize, onChange])

  const handleRemoveImage = useCallback(() => {
    onChange('')
    setUploadError(null)
  }, [onChange])

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1, color: error ? 'error.main' : 'text.primary' }}>
        {label}
      </Typography>

      {/* Área de drag and drop */}
      <Paper
        variant="outlined"
        sx={{
          borderColor: error ? 'error.main' : isDragOver ? 'primary.main' : undefined,
          borderWidth: isDragOver ? 2 : 1,
          borderStyle: isDragOver ? 'dashed' : 'solid',
          backgroundColor: isDragOver ? 'primary.50' : 'background.paper',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {value ? (
          // Vista previa de la imagen
          <Box sx={{ position: 'relative' }}>
            <Box
              component="img"
              src={value}
              alt="Vista previa"
              sx={{
                width: '100%',
                height: 200,
                objectFit: 'cover',
                display: 'block',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveImage()
                }}
                sx={{ color: 'white' }}
              >
                <i className="ri-close-line" />
              </IconButton>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                color: 'white',
                padding: 1,
                fontSize: '12px',
              }}
            >
              Haz clic para cambiar la imagen
            </Box>
          </Box>
        ) : (
          // Área de carga
          <Box
            sx={{
              height: 200,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 3,
              textAlign: 'center',
            }}
          >
            {isUploading ? (
              <CircularProgress size={40} />
            ) : (
              <>
                <i className="ri-image-line" style={{ fontSize: '48px', color: '#999', marginBottom: '16px' }} />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Arrastra una imagen aquí o haz clic para seleccionar
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  PNG, JPG, GIF hasta {maxSize}MB
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mt: 2 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClick()
                  }}
                >
                  Seleccionar imagen
                </Button>
              </>
            )}
          </Box>
        )}
      </Paper>

      {/* Input de archivo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Mensajes de error */}
      {uploadError && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {uploadError}
        </Alert>
      )}

      {helperText && (
        <Typography 
          variant="caption" 
          color={error ? 'error.main' : 'text.secondary'}
          sx={{ mt: 0.5, display: 'block' }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  )
}

export default ImageUpload 