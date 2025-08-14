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
import Collapse from '@mui/material/Collapse'

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
  id: string
  title: string
  summary: string
  content: string
  slug: string
  metaTitle: string
  metaDescription: string
  keywords: string
  coverImage: string
  coverImageAlt: string
  categoryId: string
  isPublished: boolean
  tags: string[]
}

const EditarArticuloPage = () => {
  const router = useRouter()
  const params = useParams()
  const articleSlug = params.slug as string

  const { categories, loading: categoriesLoading } = useCategories()
  const { getArticleBySlug, updateArticle, loading: updateLoading, error, clearError } = useArticles()

  const [formData, setFormData] = useState<ArticleFormData>({
    id: '',
    title: '',
    summary: '',
    content: '',
    slug: '',
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    coverImage: '',
    coverImageAlt: '',
    categoryId: '',
    isPublished: false,
    tags: []
  })

  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(true)
                const [seoExpanded, setSeoExpanded] = useState(false)
              const [basicInfoExpanded, setBasicInfoExpanded] = useState(true)
              const [contentExpanded, setContentExpanded] = useState(true)
              const [mediaExpanded, setMediaExpanded] = useState(true)

  // Cargar datos del artículo
  useEffect(() => {
    const loadArticle = async () => {
      if (articleSlug) {
        try {
          const article = await getArticleBySlug(articleSlug)

          if (article) {
            setFormData({
              id: article.id,
              title: article.title,
              summary: article.summary || '',
              content: article.content,
              slug: article.slug,
              metaTitle: article.metaTitle || '',
              metaDescription: article.metaDescription || '',
              keywords: article.metaKeywords || '',
              coverImage: article.coverImage || '',
              coverImageAlt: article.coverImageAlt || '',
              categoryId: article.category?.id || '',
              isPublished: article.isPublished,
              tags: article.tags.map((tag: any) => tag.id) || []
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
  }, [articleSlug, getArticleBySlug])

  const handleInputChange = (field: keyof ArticleFormData, value: any) => {
    console.log('handleInputChange llamado:', { field, value, type: typeof value })
    setFormData(prev => {
      const newData = {
      ...prev,
      [field]: value
      }
      console.log('Nuevo estado:', newData)
      return newData
    })
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
        id: formData.id,
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        slug: formData.slug,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        metaKeywords: formData.keywords,
        coverImage: formData.coverImage,
        categoryId: formData.categoryId,
        tagIds: formData.tags,
        isPublished: formData.isPublished
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
            <Grid container spacing={4}>
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
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1.5,
                        color: 'primary.dark',
                        backgroundColor: 'white',
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'primary.200'
                      }}>
                        <Typography variant='body2' sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                          {seoExpanded ? 'Ocultar' : 'Mostrar'}
                        </Typography>
                        <i 
                          className={seoExpanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} 
                          style={{ fontSize: '18px' }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Collapse in={seoExpanded} timeout='auto' unmountOnExit>
                    <Box sx={{ p: 5, pt: 4 }}>
                      <Grid container spacing={5}>
                        {/* SEO - Meta Título */}
                        <Grid item xs={12}>
                          <Box sx={{ mb: 1 }}>
                            <TextField
                              fullWidth
                              label='Meta Título'
                              value={formData.metaTitle}
                              onChange={e => handleInputChange('metaTitle', e.target.value)}
                              placeholder='Título para motores de búsqueda (máximo 60 caracteres)'
                              helperText={`${formData.metaTitle.length}/60 caracteres`}
                              inputProps={{ maxLength: 60 }}
                              color={formData.metaTitle.length > 50 ? 'warning' : 'primary'}
                              size='medium'
                            />
                          </Box>
                        </Grid>

                        {/* SEO - Meta Descripción */}
                        <Grid item xs={12}>
                          <Box sx={{ mb: 1 }}>
                            <TextField
                              fullWidth
                              label='Meta Descripción'
                              value={formData.metaDescription}
                              onChange={e => handleInputChange('metaDescription', e.target.value)}
                              multiline
                              rows={2}
                              placeholder='Descripción para motores de búsqueda (máximo 160 caracteres)'
                              helperText={`${formData.metaDescription.length}/160 caracteres`}
                              inputProps={{ maxLength: 160 }}
                              color={formData.metaDescription.length > 150 ? 'warning' : 'primary'}
                              size='medium'
                            />
                          </Box>
                        </Grid>

                        {/* SEO - Meta Keywords */}
                        <Grid item xs={12}>
                          <Box sx={{ mb: 1 }}>
                            <TextField
                              fullWidth
                              label='Meta Keywords'
                              value={formData.keywords}
                              onChange={e => handleInputChange('keywords', e.target.value)}
                              placeholder='Palabras clave separadas por comas'
                              helperText='Palabras clave relevantes para SEO (opcional)'
                              size='medium'
                            />
                          </Box>
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
                        {/* Slug (solo lectura) */}
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label='Slug'
                            value={formData.slug}
                            disabled
                            helperText='URL amigable del artículo (no editable)'
                            size='medium'
                            sx={{
                              '& .MuiInputBase-input.Mui-disabled': {
                                WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)',
                                backgroundColor: 'rgba(0, 0, 0, 0.04)'
                              }
                            }}
                          />
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
                            size='medium'
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
                            size='medium'
                          />
                        </Grid>

                        {/* Categoría y Estado */}
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth required>
                            <InputLabel>Categoría</InputLabel>
                            <Select
                              value={formData.categoryId || ''}
                              label='Categoría'
                              onChange={e => handleInputChange('categoryId', e.target.value)}
                              disabled={categoriesLoading}
                              size='medium'
                            >
                              {categoriesLoading ? (
                                <MenuItem disabled>Cargando categorías...</MenuItem>
                              ) : categories.length === 0 ? (
                                <MenuItem disabled>No hay categorías disponibles</MenuItem>
                              ) : (
                                categories.map(category => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.label}
                                </MenuItem>
                                ))
                              )}
                            </Select>
                          </FormControl>
                        </Grid>

                        {/* Estado */}
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            <InputLabel>Estado</InputLabel>
                            <Select
                              value={formData.isPublished.toString()}
                              label='Estado'
                              onChange={e => {
                                console.log('Select onChange:', { 
                                  targetValue: e.target.value, 
                                  convertedValue: e.target.value === 'true',
                                  currentFormData: formData.isPublished 
                                })
                                handleInputChange('isPublished', e.target.value === 'true')
                              }}
                              size='medium'
                            >
                              <MenuItem value='false'>Borrador</MenuItem>
                              <MenuItem value='true'>Publicado</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        {/* Etiquetas */}
                        <Grid item xs={12}>
                          <Box>
                            <Typography variant='subtitle1' sx={{ mb: 2, fontWeight: 500 }}>
                              Etiquetas
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb:2 }}>
                              <TextField
                                size='medium'
                                placeholder='Agregar etiqueta...'
                                value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                sx={{ flexGrow: 1 }}
                              />
                              <Button variant='outlined' onClick={handleAddTag} disabled={!tagInput.trim()}>
                                <i className='ri-add-line' style={{ marginRight: '4px' }} />
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
                                  size='medium'
                                />
                              ))}
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
                            value={`https://res.cloudinary.com/ddqh0mkx9/image/upload/${formData.coverImage}`}
                            onChange={imageUrl => handleInputChange('coverImage', imageUrl)}
                            label='Imagen Principal'
                            helperText='Imagen destacada del artículo. Recomendado: 1200x630px'
                            maxSize={1}
                            altText={formData.coverImageAlt}
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
