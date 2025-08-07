'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

// MUI Imports
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'

// Custom hooks and services
import { useCategories } from '@/hooks/useCategories'
import { useArticles } from '@/hooks/useArticles'

// Types
interface ArticleData {
  id: string
  title: string
  summary: string
  content: string
  categoryId: string
  isPublished: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
  author?: {
    id: string
    name: string
    email: string
  }
}

const VerArticuloPage = () => {
  const router = useRouter()
  const params = useParams()
  const articleId = params.id as string

  const { categories } = useCategories()
  const { getArticleById, loading, error, clearError } = useArticles()

  const [article, setArticle] = useState<ArticleData | null>(null)

  // Cargar datos del artículo
  useEffect(() => {
    const loadArticle = async () => {
      if (articleId) {
        try {
          const articleData = await getArticleById(articleId)
          if (articleData) {
            setArticle(articleData)
          }
        } catch (error) {
          console.error('Error al cargar artículo:', error)
        }
      }
    }

    loadArticle()
  }, [articleId, getArticleById])

  const handleEdit = () => {
    router.push(`/articulos/editar/${articleId}`)
  }

  const handleBack = () => {
    router.push('/articulos')
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.label : 'Categoría no encontrada'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!article) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity='error' sx={{ mb: 3 }}>
          Artículo no encontrado
        </Alert>
        <Button variant='outlined' onClick={handleBack}>
          Volver a la lista
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant='h4' component='h1'>
          Ver Artículo
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant='outlined' onClick={handleBack} startIcon={<i className='ri-arrow-left-line' />}>
            Volver
          </Button>
          <Button variant='contained' onClick={handleEdit} startIcon={<i className='ri-pencil-line' />}>
            Editar
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity='error' sx={{ mb: 3 }} onClose={clearError}>
          {error.message}
        </Alert>
      )}

      {/* Article Content */}
      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              {/* Title */}
              <Typography variant='h4' component='h2' sx={{ mb: 2 }}>
                {article.title}
              </Typography>

              {/* Summary */}
              {article.summary && (
                <Typography variant='body1' color='text.secondary' sx={{ mb: 3 }}>
                  {article.summary}
                </Typography>
              )}

              {/* Cover Image */}
              {article.coverImage && (
                <Box sx={{ mb: 3 }}>
                  <Box
                    component='img'
                    src={article.coverImage}
                    alt={article.title}
                    sx={{
                      width: '100%',
                      height: 300,
                      objectFit: 'cover',
                      borderRadius: 1
                    }}
                  />
                </Box>
              )}

              <Divider sx={{ my: 3 }} />

              {/* Content */}
              <Box
                dangerouslySetInnerHTML={{ __html: article.content }}
                sx={{
                  lineHeight: 1.6,
                  '& h1': {
                    fontSize: '2em',
                    fontWeight: 'bold',
                    margin: '0.67em 0',
                    color: 'text.primary'
                  },
                  '& h2': {
                    fontSize: '1.5em',
                    fontWeight: 'bold',
                    margin: '0.83em 0',
                    color: 'text.primary'
                  },
                  '& h3': {
                    fontSize: '1.17em',
                    fontWeight: 'bold',
                    margin: '1em 0',
                    color: 'text.primary'
                  },
                  '& p': {
                    margin: '1em 0',
                    fontSize: '16px'
                  },
                  '& ul, & ol': {
                    margin: '1em 0',
                    paddingLeft: '2em'
                  },
                  '& li': {
                    margin: '0.5em 0'
                  },
                  '& a': {
                    color: 'primary.main',
                    textDecoration: 'underline',
                    '&:hover': {
                      textDecoration: 'none'
                    }
                  },
                  '& img': {
                    maxWidth: '100%',
                    height: 'auto',
                    margin: '1em 0',
                    borderRadius: '4px'
                  },
                  '& blockquote': {
                    borderLeft: '4px solid',
                    borderColor: 'primary.main',
                    paddingLeft: '1em',
                    margin: '1em 0',
                    fontStyle: 'italic',
                    color: 'text.secondary'
                  },
                  '& pre': {
                    backgroundColor: 'grey.100',
                    padding: '1em',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    overflow: 'auto',
                    margin: '1em 0'
                  },
                  '& code': {
                    backgroundColor: 'grey.100',
                    padding: '0.2em 0.4em',
                    borderRadius: '3px',
                    fontFamily: 'monospace',
                    fontSize: '0.9em'
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Article Info */}
            <Card>
              <CardContent>
                <Typography variant='h6' sx={{ mb: 2 }}>
                  Información del Artículo
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Status */}
                  <Box>
                    <Typography variant='subtitle2' color='text.secondary'>
                      Estado
                    </Typography>
                    <Chip
                      label={article.isPublished ? 'Publicado' : 'Borrador'}
                      color={article.isPublished ? 'success' : 'warning'}
                      size='small'
                    />
                  </Box>

                  {/* Category */}
                  <Box>
                    <Typography variant='subtitle2' color='text.secondary'>
                      Categoría
                    </Typography>
                    <Typography variant='body2'>{getCategoryName(article.categoryId)}</Typography>
                  </Box>

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <Box>
                      <Typography variant='subtitle2' color='text.secondary' sx={{ mb: 1 }}>
                        Etiquetas
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {article.tags.map(tag => (
                          <Chip key={tag} label={tag} size='small' variant='outlined' />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* Author */}
                  {article.author && (
                    <Box>
                      <Typography variant='subtitle2' color='text.secondary'>
                        Autor
                      </Typography>
                      <Typography variant='body2'>{article.author.name}</Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {article.author.email}
                      </Typography>
                    </Box>
                  )}

                  {/* Dates */}
                  <Box>
                    <Typography variant='subtitle2' color='text.secondary'>
                      Fecha de creación
                    </Typography>
                    <Typography variant='body2'>{formatDate(article.createdAt)}</Typography>
                  </Box>

                  <Box>
                    <Typography variant='subtitle2' color='text.secondary'>
                      Última actualización
                    </Typography>
                    <Typography variant='body2'>{formatDate(article.updatedAt)}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent>
                <Typography variant='h6' sx={{ mb: 2 }}>
                  Acciones
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button
                    variant='contained'
                    onClick={handleEdit}
                    startIcon={<i className='ri-pencil-line' />}
                    fullWidth
                  >
                    Editar Artículo
                  </Button>
                  <Button
                    variant='outlined'
                    onClick={handleBack}
                    startIcon={<i className='ri-arrow-left-line' />}
                    fullWidth
                  >
                    Volver a la Lista
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default VerArticuloPage
