'use client'

import { useState, useEffect, useCallback } from 'react'

import { useRouter } from 'next/navigation'

// MUI Imports
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Tooltip from '@mui/material/Tooltip'
import Collapse from '@mui/material/Collapse'

// Custom hooks and services
import { useCategories } from '@/hooks/useCategories'
import { useArticles } from '@/hooks/useArticles'
import { useTags } from '@/hooks/useTags'
import { useImages } from '@/hooks/useImages'
import { useNotification } from '@/contexts/NotificationContext'

// Components
import CursorFixedWYSIWYGEditor from '@/components/CursorFixedWYSIWYGEditor'
import ImageUpload from '@/components/ImageUpload'
import { ArticlePreviewModal } from '@/components/ArticlePreviewModal'
import Breadcrumb from '@/components/Breadcrumb'

// Utils
import { generateSlug, isValidSlug } from '@/utils/slug'

// Types
interface ArticleFormData {
  title: string
  summary: string
  content: string
  slug: string
  metaTitle: string
  metaKeywords?: string
  metaDescription?: string
  coverImage?: string
  coverImageTempId?: string // Para manejar imágenes temporales
  coverImageAlt?: string // Texto alternativo de la imagen principal
  categoryId: string
  isPublished: boolean
  tagIds: string[]
}

const CrearArticuloPage = () => {
  const router = useRouter()
  const { categories, loading: categoriesLoading } = useCategories()
  const { tags, createTag } = useTags()
  const { createArticle, loading: createLoading, error, clearError } = useArticles()
  const { showSuccess, showError } = useNotification()

  // Hook para manejar imágenes
  const { moveImagesToArticle } = useImages({
    sessionId: 'temp', // Se usará solo para mover imágenes
    onError: showError
  })

  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    summary: '',
    content: '',
    slug: '',
    metaTitle: '',
    metaKeywords: '',
    metaDescription: '',
    coverImage: '',
    coverImageTempId: '',
    coverImageAlt: '',
    categoryId: '',
    isPublished: false,
    tagIds: []
  })

  const [tagInput, setTagInput] = useState('')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showExitDialog, setShowExitDialog] = useState(false)

  const [showPreview, setShowPreview] = useState(false)
  
  // Estados para los collapse de las secciones
  const [seoExpanded, setSeoExpanded] = useState(false)
  const [basicInfoExpanded, setBasicInfoExpanded] = useState(true)
  const [contentExpanded, setContentExpanded] = useState(true)
  const [mediaExpanded, setMediaExpanded] = useState(true)

  const handleInputChange = (field: keyof ArticleFormData, value: any) => {
    // Convertir el valor según el tipo de campo
    let processedValue = value

    if (field === 'isPublished') {
      processedValue = value === 'true' || value === true
    } else if (field === 'categoryId') {
      processedValue = value || ''
    }

    setFormData(prev => ({
      ...prev,
      [field]: processedValue
    }))

    setHasUnsavedChanges(true)

    // Generar slug y metaTitle automáticamente cuando cambia el título
    if (field === 'title' && value) {
      const generatedSlug = generateSlug(value)

      setFormData(prev => ({
        ...prev,
        slug: generatedSlug,
        metaTitle: value // También actualizar el meta título
      }))
    }
  }

  const handleAddTag = async () => {
    if (tagInput.trim()) {
      try {
        // Buscar si el tag ya existe
        const existingTag = tags.find(tag => tag.name.toLowerCase() === tagInput.trim().toLowerCase())

        if (existingTag) {
          // Si existe, agregar su ID
          if (!formData.tagIds.includes(existingTag.id)) {
            setFormData(prev => ({
              ...prev,
              tagIds: [...prev.tagIds, existingTag.id]
            }))
            showSuccess(`Etiqueta "${existingTag.name}" agregada`)
          } else {
            showError('Esta etiqueta ya está agregada')
          }
        } else {
          // Si no existe, crear el tag
          const newTag = await createTag(tagInput.trim())

          if (newTag) {
            setFormData(prev => ({
              ...prev,
              tagIds: [...prev.tagIds, newTag.id]
            }))
          }
        }

        setTagInput('')
      } catch (error) {
        showError('Error al agregar etiqueta. Por favor, intenta de nuevo.')
      }
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const tagName = tags.find(t => t.id === tagToRemove)?.name || 'Etiqueta'

    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.filter(tagId => tagId !== tagToRemove)
    }))

    showSuccess(`Etiqueta "${tagName}" removida`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar slug
    if (!isValidSlug(formData.slug)) {
      showError('El slug no es válido. Debe contener solo letras minúsculas, números y guiones.')

      return
    }

    // Validar campos requeridos
    if (!formData.title.trim()) {
      showError('El título es obligatorio.')

      return
    }

    if (!formData.content.trim()) {
      showError('El contenido es obligatorio.')

      return
    }

    if (!formData.slug.trim()) {
      showError('El slug es obligatorio.')

      return
    }

    if (!formData.categoryId) {
      showError('Debes seleccionar una categoría.')

      return
    }

    try {
      // Obtener la categoría para el slug
      const category = categories.find(cat => cat.id === formData.categoryId)

      if (!category) {
        showError('Categoría no encontrada.')

        return
      }

      // Recolectar todos los tempImageIds que necesitamos mover
      const tempImageIds: string[] = []

      // Agregar imagen principal si existe
      if (formData.coverImageTempId) {
        tempImageIds.push(formData.coverImageTempId)
      }

      // TODO: Recolectar tempImageIds de las imágenes del contenido
      // Esto requerirá rastrear las imágenes insertadas en el editor

      // Mover imágenes a su ubicación final
      if (tempImageIds.length > 0) {
        const movedImages = await moveImagesToArticle(tempImageIds, category.slug, formData.slug)

        if (movedImages) {
          // Actualizar las URLs de las imágenes con las nuevas URLs
          const updatedContent = formData.content
          let updatedCoverImage = formData.coverImage

          movedImages.forEach(movedImage => {
            // Actualizar imagen principal si corresponde
            if (movedImage.tempImageId === formData.coverImageTempId) {
              updatedCoverImage = movedImage.newUrl
            }

            // TODO: Actualizar URLs en el contenido del artículo
            // Esto requerirá reemplazar las URLs temporales con las nuevas URLs
          })

          // Actualizar el formData con las nuevas URLs
          setFormData(prev => ({
            ...prev,
            content: updatedContent,
            coverImage: updatedCoverImage
          }))
        }
      }

      const newArticle = await createArticle({
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        slug: formData.slug,
        metaTitle: formData.metaTitle,
        metaKeywords: formData.metaKeywords,
        metaDescription: formData.metaDescription,
        coverImage: formData.coverImage,
        coverImageAlt: formData.coverImageAlt,
        categoryId: formData.categoryId,
        tagIds: formData.tagIds
      })

      if (newArticle) {
        setHasUnsavedChanges(false)
        showSuccess('Artículo creado exitosamente')
        setTimeout(() => {
          router.push('/articulos')
        }, 1500)
      }
    } catch (error) {
      console.error('Error al crear artículo:', error)
      showError('Error al crear el artículo. Por favor, intenta de nuevo.')
    }
  }



  // Confirmar antes de salir si hay cambios no guardados
  const handleBeforeUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    },
    [hasUnsavedChanges]
  )

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [handleBeforeUnload])

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowExitDialog(true)
    } else {
      router.push('/articulos')
    }
  }

  const handleConfirmExit = () => {
    setShowExitDialog(false)
    router.push('/articulos')
  }

  const handleCancelExit = () => {
    setShowExitDialog(false)
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            label: 'Artículos',
            href: '/articulos',
            icon: 'ri-article-line'
          },
          {
            label: 'Crear artículo',
            icon: 'ri-add-line'
          }
        ]}
        currentPage="Nuevo artículo"
      />

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant='h4' component='h1'>
            Crear Nuevo Artículo
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            {hasUnsavedChanges && (
              <Chip label='Cambios no guardados' color='warning' size='small' icon={<i className='ri-save-line' />} />
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title='Vista previa'>
            <Button
              variant='outlined'
              onClick={() => setShowPreview(!showPreview)}
              startIcon={<i className='ri-eye-line' />}
            >
              {showPreview ? 'Ocultar Vista Previa' : 'Vista Previa'}
            </Button>
          </Tooltip>

          <Button variant='outlined' onClick={handleCancel} startIcon={<i className='ri-arrow-left-line' />}>
            Volver
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity='error' sx={{ mb: 3 }} onClose={clearError}>
          {error.message}
        </Alert>
      )}

      {/* Form */}
      <Card>
        <CardContent>
          {/* Indicador de progreso */}
          <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant='subtitle2' sx={{ mb: 1 }}>
              Progreso del formulario
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label='Título'
                color={formData.title ? 'success' : 'default'}
                size='small'
                icon={<i className={formData.title ? 'ri-check-line' : 'ri-close-line'} />}
              />
              <Chip
                label='Contenido'
                color={formData.content ? 'success' : 'default'}
                size='small'
                icon={<i className={formData.content ? 'ri-check-line' : 'ri-close-line'} />}
              />
              <Chip
                label='Slug'
                color={formData.slug && isValidSlug(formData.slug) ? 'success' : 'default'}
                size='small'
                icon={<i className={formData.slug && isValidSlug(formData.slug) ? 'ri-check-line' : 'ri-close-line'} />}
              />
              <Chip
                label='Categoría'
                color={formData.categoryId ? 'success' : 'default'}
                size='small'
                icon={<i className={formData.categoryId ? 'ri-check-line' : 'ri-close-line'} />}
              />
              <Chip
                label='SEO'
                color={formData.metaTitle && formData.metaKeywords && formData.metaDescription ? 'success' : 'default'}
                size='small'
                icon={
                  <i
                    className={
                      formData.metaTitle && formData.metaKeywords && formData.metaDescription
                        ? 'ri-check-line'
                        : 'ri-close-line'
                    }
                  />
                }
              />
            </Box>
          </Box>
          <Box component='form' onSubmit={handleSubmit}>
            <Grid container spacing={5}>
              {/* SECCIÓN: OPTIMIZACIÓN SEO - COLLAPSE CON CARD */}
              <Grid item xs={12}>
                <Card 
                  variant='outlined' 
                  sx={{ 
                    mb: 4,
                    borderColor: 'primary.light',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: 2
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      p: 3, 
                      cursor: 'pointer',
                      backgroundColor: seoExpanded ? 'primary.100' : 'primary.50',
                      transition: 'all 0.3s ease-in-out'
                    }}
                    onClick={() => setSeoExpanded(!seoExpanded)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box sx={{ 
                          backgroundColor: 'primary.main', 
                          borderRadius: '50%', 
                          width: 48, 
                          height: 48, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          color: 'white',
                          boxShadow: 2
                        }}>
                          <i className='ri-search-line' style={{ fontSize: '24px' }} />
                        </Box>
                        <Box>
                          <Typography variant='h6' component='h2' sx={{ 
                            color: 'primary.dark', 
                            fontWeight: 700,
                            mb: 1,
                            fontSize: '1.25rem'
                          }}>
                            Optimización SEO
                          </Typography>
                          <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.95rem' }}>
                            Configura los metadatos para mejorar la visibilidad en motores de búsqueda
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'primary.dark', backgroundColor: 'white', px: 2, py: 1, borderRadius: 2, border: '1px solid', borderColor: 'primary.200' }}>
                        <Typography variant='body2' sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{seoExpanded ? 'Ocultar' : 'Mostrar'}</Typography>
                        <i className={seoExpanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} style={{ fontSize: '18px' }} />
                      </Box>
                    </Box>
                  </Box>
                  <Collapse in={seoExpanded} timeout='auto' unmountOnExit>
                    <Box sx={{ p: 5, pt: 4 }}>
                      <Grid container spacing={5}>
                        {/* Meta Título */}
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label='Meta Título'
                            value={formData.metaTitle}
                            onChange={e => handleInputChange('metaTitle', e.target.value)}
                            placeholder='Título para motores de búsqueda (máximo 60 caracteres)'
                            inputProps={{ maxLength: 60 }}
                            helperText={`${formData.metaTitle.length}/60 caracteres`}
                            color={formData.metaTitle.length > 50 ? 'warning' : 'primary'}
                            size='medium'
                          />
                        </Grid>

                        {/* Meta Keywords */}
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label='Meta Keywords'
                            value={formData.metaKeywords}
                            onChange={e => handleInputChange('metaKeywords', e.target.value)}
                            placeholder='Palabras clave separadas por comas'
                            helperText='Palabras clave relevantes para SEO (opcional)'
                            size='medium'
                          />
                        </Grid>

                        {/* Meta Description */}
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label='Meta Description'
                            value={formData.metaDescription}
                            onChange={e => handleInputChange('metaDescription', e.target.value)}
                            multiline
                            rows={2}
                            placeholder='Descripción para motores de búsqueda (máximo 160 caracteres)'
                            inputProps={{ maxLength: 160 }}
                            helperText={`${formData.metaDescription?.length}/160 caracteres`}
                            color={
                              formData.metaDescription?.length && formData.metaDescription?.length > 150 ? 'warning' : 'primary'
                            }
                            size='medium'
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Collapse>
                </Card>
              </Grid>

              {/* SECCIÓN: INFORMACIÓN BÁSICA - COLLAPSE CON CARD */}
              <Grid item xs={12}>
                <Card 
                  variant='outlined' 
                  sx={{ 
                    mb: 4,
                    borderColor: 'primary.light',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: 2
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      p: 3, 
                      cursor: 'pointer',
                      backgroundColor: basicInfoExpanded ? 'primary.100' : 'primary.50',
                      transition: 'all 0.3s ease-in-out'
                    }}
                    onClick={() => setBasicInfoExpanded(!basicInfoExpanded)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box sx={{ 
                          backgroundColor: 'primary.main', 
                          borderRadius: '50%', 
                          width: 48, 
                          height: 48, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          color: 'white',
                          boxShadow: 2
                        }}>
                          <i className='ri-article-line' style={{ fontSize: '24px' }} />
                        </Box>
                        <Box>
                          <Typography variant='h6' component='h2' sx={{ 
                            color: 'primary.dark', 
                            fontWeight: 700,
                            mb: 1,
                            fontSize: '1.25rem'
                          }}>
                            Información Básica
                          </Typography>
                          <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.95rem' }}>
                            Configura los datos principales del artículo
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'primary.dark', backgroundColor: 'white', px: 2, py: 1, borderRadius: 2, border: '1px solid', borderColor: 'primary.200' }}>
                        <Typography variant='body2' sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{basicInfoExpanded ? 'Ocultar' : 'Mostrar'}</Typography>
                        <i className={basicInfoExpanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} style={{ fontSize: '18px' }} />
                      </Box>
                    </Box>
                  </Box>
                  <Collapse in={basicInfoExpanded} timeout='auto' unmountOnExit>
                    <Box sx={{ p: 5, pt: 4 }}>
                      <Grid container spacing={5}>
                        {/* Título */}
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label='Título del artículo'
                            value={formData.title}
                            onChange={e => handleInputChange('title', e.target.value)}
                            required
                            placeholder='Ingresa el título del artículo...'
                            size='medium'
                          />
                        </Grid>

                        {/* Slug */}
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label='Slug (URL)'
                            value={formData.slug}
                            onChange={e => handleInputChange('slug', e.target.value)}
                            required
                            placeholder='url-del-articulo'
                            error={!!formData.slug && !isValidSlug(formData.slug)}
                            size='medium'
                          />
                        </Grid>

                        {/* Categoría */}
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth required>
                            <InputLabel>Categoría</InputLabel>
                            <Select
                              value={formData.categoryId}
                              label='Categoría'
                              onChange={e => {
                                const categoryId = e.target.value || ''

                                setFormData(prev => ({ ...prev, categoryId }))
                                setHasUnsavedChanges(true)
                              }}
                              disabled={categoriesLoading}
                              size='medium'
                            >
                              {(categories || []).map(category => (
                                <MenuItem key={category.id} value={category.id}>
                                  {category.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>

                        {/* Resumen */}
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label='Resumen'
                            value={formData.summary}
                            onChange={e => handleInputChange('summary', e.target.value)}
                            multiline
                            rows={3}
                            placeholder='Escribe un resumen del artículo...'
                            helperText='Breve descripción que aparecerá en las vistas previas'
                            size='medium'
                          />
                        </Grid>

                        {/* Estado */}
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            <InputLabel>Estado</InputLabel>
                            <Select
                              value={formData.isPublished ? 'true' : 'false'}
                              label='Estado'
                              onChange={e => {
                                const isPublished = e.target.value === 'true'

                                setFormData(prev => ({ ...prev, isPublished }))
                                setHasUnsavedChanges(true)
                              }}
                              size='medium'
                            >
                              <MenuItem value='false'>Borrador</MenuItem>
                              <MenuItem value='true'>Publicado</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        {/* Tags */}
                        <Grid item xs={12} md={6}>
                          <Box>
                            <Typography variant='subtitle1' sx={{ mb: 2, fontWeight: 500 }}>
                              Etiquetas
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                              <TextField
                                placeholder='Agregar etiqueta...'
                                value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                sx={{ flexGrow: 1 }}
                                size='medium'
                              />
                              <Button variant='outlined' onClick={handleAddTag} disabled={!tagInput.trim()}>
                                <i className='ri-add-line' style={{ marginRight: '4px' }} />
                                Agregar
                              </Button>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {formData.tagIds.map(tagId => {
                                const tag = (tags || []).find(t => t.id === tagId)

                                return (
                                  <Chip
                                    key={tagId}
                                    label={tag ? tag.name : tagId}
                                    onDelete={() => handleRemoveTag(tagId)}
                                    color='primary'
                                    variant='outlined'
                                    size='medium'
                                  />
                                )
                              })}
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Collapse>
                </Card>
              </Grid>

              {/* SECCIÓN: MEDIA - COLLAPSE CON CARD */}
              <Grid item xs={12}>
                <Card 
                  variant='outlined' 
                  sx={{ 
                    mb: 4,
                    borderColor: 'primary.light',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: 2
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      p: 3, 
                      cursor: 'pointer',
                      backgroundColor: mediaExpanded ? 'primary.100' : 'primary.50',
                      transition: 'all 0.3s ease-in-out'
                    }}
                    onClick={() => setMediaExpanded(!mediaExpanded)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box sx={{ 
                          backgroundColor: 'primary.main', 
                          borderRadius: '50%', 
                          width: 48, 
                          height: 48, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          color: 'white',
                          boxShadow: 2
                        }}>
                          <i className='ri-image-line' style={{ fontSize: '24px' }} />
                        </Box>
                        <Box>
                          <Typography variant='h6' component='h2' sx={{ 
                            color: 'primary.dark', 
                            fontWeight: 700,
                            mb: 1,
                            fontSize: '1.25rem'
                          }}>
                            Media
                          </Typography>
                          <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.95rem' }}>
                            Configura la imagen principal del artículo
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'primary.dark', backgroundColor: 'white', px: 2, py: 1, borderRadius: 2, border: '1px solid', borderColor: 'primary.200' }}>
                        <Typography variant='body2' sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{mediaExpanded ? 'Ocultar' : 'Mostrar'}</Typography>
                        <i className={mediaExpanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} style={{ fontSize: '18px' }} />
                      </Box>
                    </Box>
                  </Box>
                  <Collapse in={mediaExpanded} timeout='auto' unmountOnExit>
                    <Box sx={{ p: 5, pt: 4 }}>
                      <Grid container spacing={5}>
                        <Grid item xs={12}>
                          <ImageUpload
                            value={formData.coverImage}
                            onChange={imageUrl => handleInputChange('coverImage', imageUrl)}
                            onTempImageIdChange={tempImageId => handleInputChange('coverImageTempId', tempImageId)}
                            altText={formData.coverImageAlt}
                            onAltTextChange={altText => handleInputChange('coverImageAlt', altText)}
                            label='Imagen Principal'
                            maxSize={8}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Collapse>
                </Card>
              </Grid>

              {/* SECCIÓN: CONTENIDO DEL ARTÍCULO - COLLAPSE CON CARD */}
              <Grid item xs={12}>
                <Card 
                  variant='outlined' 
                  sx={{ 
                    mb: 4,
                    borderColor: 'primary.light',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: 2
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      p: 3, 
                      cursor: 'pointer',
                      backgroundColor: contentExpanded ? 'primary.100' : 'primary.50',
                      transition: 'all 0.3s ease-in-out'
                    }}
                    onClick={() => setContentExpanded(!contentExpanded)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box sx={{ 
                          backgroundColor: 'primary.main', 
                          borderRadius: '50%', 
                          width: 48, 
                          height: 48, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          color: 'white',
                          boxShadow: 2
                        }}>
                          <i className='ri-file-text-line' style={{ fontSize: '24px' }} />
                        </Box>
                        <Box>
                          <Typography variant='h6' component='h2' sx={{ 
                            color: 'primary.dark', 
                            fontWeight: 700,
                            mb: 1,
                            fontSize: '1.25rem'
                          }}>
                            Contenido del Artículo
                          </Typography>
                          <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.95rem' }}>
                            Escribe el contenido principal del artículo usando el editor de texto enriquecido
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'primary.dark', backgroundColor: 'white', px: 2, py: 1, borderRadius: 2, border: '1px solid', borderColor: 'primary.200' }}>
                        <Typography variant='body2' sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{contentExpanded ? 'Ocultar' : 'Mostrar'}</Typography>
                        <i className={contentExpanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} style={{ fontSize: '18px' }} />
                      </Box>
                    </Box>
                  </Box>
                  <Collapse in={contentExpanded} timeout='auto' unmountOnExit>
                    <Box sx={{ p: 5, pt: 4 }}>
                      <Grid container spacing={5}>
                        <Grid item xs={12}>
                          <CursorFixedWYSIWYGEditor
                            value={formData.content}
                            onChange={value => handleInputChange('content', value)}
                            label='Contenido del artículo'
                            placeholder='Escribe el contenido del artículo. Usa los botones de la barra de herramientas para dar formato...'
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Collapse>
                </Card>
              </Grid>

              {/* Botones de acción */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button variant='outlined' onClick={handleCancel} disabled={createLoading}>
                    Cancelar
                  </Button>
                  <Button
                    type='submit'
                    variant='contained'
                    disabled={
                      createLoading || !formData.title || !formData.content || !formData.slug || !formData.categoryId
                    }
                    startIcon={createLoading ? <CircularProgress size={20} /> : <i className='ri-save-line' />}
                  >
                    {createLoading ? 'Creando...' : 'Crear Artículo'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Modal de vista previa del artículo */}
      <ArticlePreviewModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        title={formData.title}
        summary={formData.summary}
        content={formData.content}
        coverImage={formData.coverImage || ''}
        category={categories.find(cat => cat.id === formData.categoryId)}
        isPublished={formData.isPublished}
        tags={formData.tagIds}
      />

      {/* Dialog de confirmación de salida */}
      <Dialog open={showExitDialog} onClose={handleCancelExit}>
        <DialogTitle>¿Salir sin guardar?</DialogTitle>
        <DialogContent>
          <Typography>Tienes cambios no guardados. ¿Estás seguro de que quieres salir sin guardar?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelExit}>Cancelar</Button>
          <Button onClick={handleConfirmExit} color='error' variant='contained'>
            Salir sin guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CrearArticuloPage
