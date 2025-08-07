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
import Snackbar from '@mui/material/Snackbar'
import Tooltip from '@mui/material/Tooltip'

// Custom hooks and services
import { useCategories } from '@/hooks/useCategories'
import { useArticles } from '@/hooks/useArticles'
import { useTags } from '@/hooks/useTags'

// Components
import WYSIWYGEditor from '@/components/WYSIWYGEditor'
import ImageUpload from '@/components/ImageUpload'
import { ArticlePreview } from '@/components/ArticlePreview'

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

  // Debug logs
  console.log('🔍 Componente CrearArticuloPage - categories:', categories)
  console.log('🔍 Componente CrearArticuloPage - categoriesLoading:', categoriesLoading)

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
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false)
  const [autoSaveEnabled] = useState(true)
  const [showPreview, setShowPreview] = useState(false)

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
        console.error('Error al agregar etiqueta:', error)
      }
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.filter(tagId => tagId !== tagToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar slug
    if (!isValidSlug(formData.slug)) {
      alert('El slug no es válido. Debe contener solo letras minúsculas, números y guiones.')
      
return
    }

    // Validar campos requeridos
    if (!formData.title.trim()) {
      alert('El título es obligatorio.')
      
return
    }

    if (!formData.content.trim()) {
      alert('El contenido es obligatorio.')
      
return
    }

    if (!formData.slug.trim()) {
      alert('El slug es obligatorio.')
      
return
    }

    if (!formData.categoryId) {
      alert('Debes seleccionar una categoría.')
      
return
    }

    try {
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
        setShowSuccessSnackbar(true)
        setTimeout(() => {
          router.push('/articulos')
        }, 1500)
      }
    } catch (error) {
      console.error('Error al crear artículo:', error)
    }
  }

  // Guardado automático como borrador
  const autoSave = useCallback(async () => {
    if (!autoSaveEnabled || !hasUnsavedChanges || !formData.title) return

    try {
      await createArticle({
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
        tagIds: formData.tagIds,
        isPublished: false // Siempre guardar como borrador
      })
      setHasUnsavedChanges(false)
      setShowSuccessSnackbar(true)
    } catch (error) {
      console.error('Error en guardado automático:', error)
    }
  }, [autoSaveEnabled, hasUnsavedChanges, formData, createArticle])

  // Auto-save cada 30 segundos
  useEffect(() => {
    if (!autoSaveEnabled) return

    const interval = setInterval(autoSave, 30000)

    
return () => clearInterval(interval)
  }, [autoSave, autoSaveEnabled])

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
            {autoSaveEnabled && (
              <Chip label='Auto-guardado activo' color='success' size='small' icon={<i className='ri-time-line' />} />
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
          <Tooltip title='Guardar como borrador'>
            <span>
              <Button
                variant='outlined'
                onClick={autoSave}
                disabled={!hasUnsavedChanges || createLoading}
                startIcon={<i className='ri-save-line' />}
              >
                Guardar
              </Button>
            </span>
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
              <Grid item xs={12}>
                <Typography variant='h6' sx={{ mb: 2, color: 'primary.main' }}>
                  Datos del artículo
                </Typography>
              </Grid>
              {/* Título */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Título del artículo'
                  value={formData.title}
                  onChange={e => handleInputChange('title', e.target.value)}
                  required
                  placeholder='Ingresa el título del artículo...'
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
                />
              </Grid>

              {/* Imagen Principal */}
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
                  >
                    <MenuItem value='false'>Borrador</MenuItem>
                    <MenuItem value='true'>Publicado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Tags */}
              <Grid item xs={12} md={6}>
                <Box>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                      placeholder='Agregar etiqueta...'
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      sx={{ flexGrow: 1 }}
                    />
                    <Button variant='outlined' onClick={handleAddTag} disabled={!tagInput.trim()}>
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
                        />
                      )
                    })}
                  </Box>
                </Box>
              </Grid>

              {/* Contenido */}
              <Grid item xs={12}>
                <WYSIWYGEditor
                  value={formData.content}
                  onChange={value => handleInputChange('content', value)}
                  label='Contenido del artículo'
                  placeholder='Escribe el contenido del artículo. Usa los botones de la barra de herramientas para dar formato...'
                />
              </Grid>

              {/* SEO Section */}
              <Grid item xs={12}>
                <Typography variant='h6' sx={{ mb: 2, color: 'primary.main' }}>
                  Configuración SEO
                </Typography>
              </Grid>

              {/* Meta Título */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label='Meta Título'
                  value={formData.metaTitle}
                  onChange={e => handleInputChange('metaTitle', e.target.value)}
                  placeholder='Título para motores de búsqueda'
                  inputProps={{ maxLength: 60 }}
                  helperText={`${formData.metaTitle.length}/60 caracteres`}
                  color={formData.metaTitle.length > 50 ? 'warning' : 'primary'}
                />
              </Grid>

              {/* Meta Keywords */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label='Meta Keywords'
                  value={formData.metaKeywords}
                  onChange={e => handleInputChange('metaKeywords', e.target.value)}
                  placeholder='palabra1, palabra2, palabra3'
                  helperText='Palabras clave separadas por comas para SEO'
                />
              </Grid>

              {/* Meta Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Meta Description'
                  value={formData.metaDescription}
                  onChange={e => handleInputChange('metaDescription', e.target.value)}
                  placeholder='Descripción para motores de búsqueda'
                  inputProps={{ maxLength: 160 }}
                  helperText={`${formData.metaDescription?.length}/160 caracteres`}
                  color={formData.metaDescription?.length && formData.metaDescription?.length > 150 ? 'warning' : 'primary'} 
                />
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

      {/* Vista previa del artículo */}
      {showPreview && (
        <Box sx={{ mt: 4 }}>
          <ArticlePreview
            title={formData.title}
            summary={formData.summary}
            content={formData.content}
            coverImage={formData.coverImage || ''}
            category={categories.find(cat => cat.id === formData.categoryId)}
            author={{ name: 'Usuario Actual', email: 'usuario@ejemplo.com' }}
            isPublished={formData.isPublished}
            tags={formData.tagIds}
            metaTitle={formData.metaTitle}
            metaDescription={formData.metaDescription || ''}
            keywords={formData.metaKeywords || ''}
          />
        </Box>
      )}

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

      {/* Snackbar de éxito */}
      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSuccessSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSuccessSnackbar(false)} severity='success' sx={{ width: '100%' }}>
          ¡Artículo guardado exitosamente!
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default CrearArticuloPage
