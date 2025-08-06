'use client'

import { useState } from 'react'
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

// Custom hooks and services
import { useCategories } from '@/hooks/useCategories'
import { useArticles } from '@/hooks/useArticles'

// Components
import WYSIWYGEditor from '@/components/WYSIWYGEditor'

// Utils
import { generateSlug, isValidSlug } from '@/utils/slug'

// Types
interface ArticleFormData {
  title: string
  summary: string
  content: string
  slug: string
  metaTitle: string
  metaDescription: string
  keywords: string
  categoryId: string
  isPublished: boolean
  tags: string[]
}

const CrearArticuloPage = () => {
  const router = useRouter()
  const { categories, loading: categoriesLoading } = useCategories()
  const { createArticle, loading: createLoading, error, clearError } = useArticles()

  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    summary: '',
    content: '',
    slug: '',
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    categoryId: '',
    isPublished: false,
    tags: [],
  })

  const [tagInput, setTagInput] = useState('')

  const handleInputChange = (field: keyof ArticleFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))

    // Generar slug automáticamente cuando cambia el título
    if (field === 'title' && value) {
      const generatedSlug = generateSlug(value)
      setFormData(prev => ({
        ...prev,
        slug: generatedSlug,
        metaTitle: value, // También actualizar el meta título
      }))
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
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
      const newArticle = await createArticle({
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        slug: formData.slug,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        metaKeywords: formData.keywords,
        categoryId: formData.categoryId,
        tags: formData.tags,
      })

      if (newArticle) {
        router.push('/articulos')
      }
    } catch (error) {
      console.error('Error al crear artículo:', error)
    }
  }

  const handleCancel = () => {
    router.push('/articulos')
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant='h4' component='h1'>
          Crear Nuevo Artículo
        </Typography>
        <Button
          variant='outlined'
          onClick={handleCancel}
          startIcon={<i className='ri-arrow-left-line' />}
        >
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
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Datos del artículo
                </Typography>
              </Grid>
              {/* Título */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Título del artículo"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                  placeholder="Ingresa el título del artículo..."
                  helperText="El título aparecerá en la página y será usado para generar el slug automáticamente"
                />
              </Grid>

              {/* Slug */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Slug (URL)"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  required
                  placeholder="url-del-articulo"
                  helperText="URL amigable para SEO. Se genera automáticamente desde el título"
                  error={formData.slug && !isValidSlug(formData.slug)}
                />
              </Grid>

              {/* Categoría */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    value={formData.categoryId}
                    label="Categoría"
                    onChange={(e) => handleInputChange('categoryId', e.target.value)}
                    disabled={categoriesLoading}
                  >
                    {categories.map((category) => (
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
                  label="Resumen"
                  value={formData.summary}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                  multiline
                  rows={3}
                  placeholder="Escribe un resumen del artículo..."
                  helperText="Breve descripción que aparecerá en las vistas previas"
                />
              </Grid>

              {/* Estado */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={formData.isPublished ? 'true' : 'false'}
                    label="Estado"
                    onChange={(e) => handleInputChange('isPublished', e.target.value === 'true')}
                  >
                    <MenuItem value="false">Borrador</MenuItem>
                    <MenuItem value="true">Publicado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Tags */}
              <Grid item xs={12} md={6}>
                <Box>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                      placeholder="Agregar etiqueta..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      sx={{ flexGrow: 1 }}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleAddTag}
                      disabled={!tagInput.trim()}
                    >
                      Agregar
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => handleRemoveTag(tag)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              </Grid>

              {/* Contenido */}
              <Grid item xs={12}>
                <WYSIWYGEditor
                  value={formData.content}
                  onChange={(value) => handleInputChange('content', value)}
                  label="Contenido del artículo"
                  placeholder="Escribe el contenido del artículo. Usa los botones de la barra de herramientas para dar formato..."
                />
              </Grid>

              {/* SEO Section */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Configuración SEO
                </Typography>
              </Grid>

              {/* Meta Título */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Meta Título"
                  value={formData.metaTitle}
                  onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                  placeholder="Título para motores de búsqueda"
                  helperText="Título que aparecerá en los resultados de búsqueda (máx. 60 caracteres)"
                  inputProps={{ maxLength: 60 }}
                />
              </Grid>

              {/* Keywords */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Palabras Clave"
                  value={formData.keywords}
                  onChange={(e) => handleInputChange('keywords', e.target.value)}
                  placeholder="palabra1, palabra2, palabra3"
                  helperText="Palabras clave separadas por comas para SEO"
                />
              </Grid>

              {/* Meta Descripción */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Meta Descripción"
                  value={formData.metaDescription}
                  onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                  multiline
                  rows={2}
                  placeholder="Descripción que aparecerá en los resultados de búsqueda"
                  helperText="Descripción para motores de búsqueda (máx. 160 caracteres)"
                  inputProps={{ maxLength: 160 }}
                />
              </Grid>

              {/* Botones de acción */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={createLoading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={createLoading || !formData.title || !formData.content || !formData.categoryId}
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
    </Box>
  )
}

export default CrearArticuloPage 