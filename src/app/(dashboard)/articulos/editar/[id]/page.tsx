'use client'

import { useState, useEffect } from 'react'

import { useRouter, useParams } from 'next/navigation'

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

// Custom hooks and services
import { useCategories } from '@/hooks/useCategories'
import { useArticles } from '@/hooks/useArticles'

// Components
import CursorFixedWYSIWYGEditor from '@/components/CursorFixedWYSIWYGEditor'
import ImageUpload from '@/components/ImageUpload'
import Breadcrumb from '@/components/Breadcrumb'

// Utils
import { isValidSlug } from '@/utils/slug'

// Types
interface ArticleFormData {
  title: string
  summary: string
  content: string
  slug: string
  metaTitle: string
  metaDescription: string
  keywords: string
  coverImage: string
  categoryId: string
  isPublished: boolean
  tags: string[]
}

const EditarArticuloPage = () => {
  const router = useRouter()
  const params = useParams()
  const articleId = params.id as string

  const { categories, loading: categoriesLoading } = useCategories()
  const { getArticleById, updateArticle, loading: updateLoading, error, clearError } = useArticles()

  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    summary: '',
    content: '',
    slug: '',
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    coverImage: '',
    categoryId: '',
    isPublished: false,
    tags: []
  })

  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(true)

  // Cargar datos del artículo
  useEffect(() => {
    const loadArticle = async () => {
      if (articleId) {
        try {
          const article = await getArticleById(articleId)

          if (article) {
            setFormData({
              title: article.title,
              summary: article.summary || '',
              content: article.content,
              slug: article.slug,
              metaTitle: article.metaTitle || '',
              metaDescription: article.metaDescription || '',
              keywords: article.metaKeywords || '',
              coverImage: article.coverImage || '',
              categoryId: article.category?.id || '',
              isPublished: article.isPublished,
              tags: article.tags.map(tag => tag.id) || []
            })
          }
        } catch (error) {
          console.error('Error al cargar artículo:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    loadArticle()
  }, [articleId, getArticleById])

  const handleInputChange = (field: keyof ArticleFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar slug
    if (!isValidSlug(formData.slug)) {
      alert('El slug no es válido. Debe contener solo letras minúsculas, números y guiones.')

      return
    }

    try {
      const updatedArticle = await updateArticle({
        id: articleId,
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        slug: formData.slug,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        metaKeywords: formData.keywords,
        coverImage: formData.coverImage,
        categoryId: formData.categoryId,
        tagIds: formData.tags
      })

      if (updatedArticle) {
        router.push('/articulos')
      }
    } catch (error) {
      console.error('Error al actualizar artículo:', error)
    }
  }

  const handleCancel = () => {
    router.push('/articulos')
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    )
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
            label: 'Editar artículo',
            icon: 'ri-edit-line'
          }
        ]}
        currentPage="Editando artículo"
      />

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant='h4' component='h1'>
          Editar Artículo
        </Typography>
        <Button variant='outlined' onClick={handleCancel} startIcon={<i className='ri-arrow-left-line' />}>
          Volver
        </Button>
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
          <Box component='form' onSubmit={handleSubmit}>
            <Grid container spacing={3}>
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
                  label='Imagen Principal'
                  helperText='Imagen destacada del artículo. Recomendado: 1200x630px'
                  maxSize={5}
                />
              </Grid>

              {/* Categoría */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    value={formData.categoryId}
                    label='Categoría'
                    onChange={e => handleInputChange('categoryId', e.target.value)}
                    disabled={categoriesLoading}
                  >
                    {categories.map(category => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Estado */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={formData.isPublished}
                    label='Estado'
                    onChange={e => handleInputChange('isPublished', e.target.value)}
                  >
                    <MenuItem value='false'>Borrador</MenuItem>
                    <MenuItem value='true'>Publicado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Tags */}
              <Grid item xs={12}>
                <Box>
                  <Typography variant='subtitle2' sx={{ mb: 1 }}>
                    Etiquetas
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                      size='small'
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
                    {formData.tags.map(tag => (
                      <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => handleRemoveTag(tag)}
                        color='primary'
                        variant='outlined'
                      />
                    ))}
                  </Box>
                </Box>
              </Grid>

              {/* Contenido */}
              <Grid item xs={12}>
                <CursorFixedWYSIWYGEditor
                  value={formData.content}
                  onChange={value => handleInputChange('content', value)}
                  label='Contenido del artículo'
                  placeholder='Escribe el contenido del artículo. Usa los botones de la barra de herramientas para dar formato...'
                />
              </Grid>

              {/* Botones de acción */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button variant='outlined' onClick={handleCancel} disabled={updateLoading}>
                    Cancelar
                  </Button>
                  <Button
                    type='submit'
                    variant='contained'
                    disabled={updateLoading || !formData.title || !formData.content || !formData.categoryId}
                    startIcon={updateLoading ? <CircularProgress size={20} /> : <i className='ri-save-line' />}
                  >
                    {updateLoading ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default EditarArticuloPage
