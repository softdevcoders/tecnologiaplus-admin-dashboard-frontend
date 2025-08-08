import { Suspense } from 'react'

import { notFound } from 'next/navigation'

import type { Metadata } from 'next'

// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'

// Components
import Breadcrumb from '@/components/Breadcrumb'

// Services
import articlesService from '@/services/articles.service'

// Types
interface ArticleData {
  id: string
  title: string
  summary?: string
  content: string
  slug: string
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
  category?: {
    id: string
    label: string
  }
  coverImage?: string
  isPublished: boolean
  tags: Array<{
    id: string
    name: string
  }>
  createdAt: string
  updatedAt: string
  author?: {
    id: string
    name: string
    email: string
  }
}

interface PageProps {
  params: Promise<{ slug: string }>
}

// Función para generar metadata dinámica
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const response = await articlesService.getArticleBySlug(slug)
    
    if (response.success && response.data) {
      const article = response.data
      
      return {
        title: article.metaTitle || article.title,
        description: article.metaDescription || article.summary || `Lee el artículo: ${article.title}`,
        keywords: article.metaKeywords,
        openGraph: {
          title: article.metaTitle || article.title,
          description: article.metaDescription || article.summary,
          type: 'article',
          images: article.coverImage ? [article.coverImage] : [],
          authors: article.author ? [article.author.name] : [],
          publishedTime: article.createdAt,
          modifiedTime: article.updatedAt,
        },
        twitter: {
          card: 'summary_large_image',
          title: article.metaTitle || article.title,
          description: article.metaDescription || article.summary,
          images: article.coverImage ? [article.coverImage] : [],
        },
        alternates: {
          canonical: `/articulos/ver/${article.slug}`,
        },
      }
    }
  } catch (error) {
    console.error('Error al generar metadata:', error)
  }
  
  return {
    title: 'Artículo no encontrado',
    description: 'El artículo que buscas no existe.',
  }
}

// Función para obtener datos del artículo en el servidor
async function getArticleData(slug: string): Promise<ArticleData | null> {
  try {
    const response = await articlesService.getArticleBySlug(slug)
    
    if (response.success) {
      return response.data
    }
    
    return null
  } catch (error) {
    console.error('Error al cargar artículo:', error)
    return null
  }
}

// Función auxiliar para formatear fecha
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Función auxiliar para obtener nombre de categoría
function getCategoryName(category?: { id: string; label: string }): string {
  return category ? category.label : 'Categoría no encontrada'
}

// Componente de loading
function LoadingSpinner() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <CircularProgress />
    </Box>
  )
}

// Componente principal de la página
async function VerArticuloPorSlugPage({ params }: PageProps) {
  const { slug } = await params
  
  // Obtener datos del artículo en el servidor
  const article = await getArticleData(slug)
  
  // Si no se encuentra el artículo, mostrar 404
  if (!article) {
    notFound()
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant='h4' component='h1'>
          Ver Artículo
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant='outlined' 
            href='/articulos'
            startIcon={<i className='ri-arrow-left-line' />}
          >
            Volver
          </Button>
          <Button 
            variant='contained' 
            href={`/articulos/editar/${article.id}`}
            startIcon={<i className='ri-pencil-line' />}
          >
            Editar
          </Button>
        </Box>
      </Box>

      {/* Article Content */}
      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ mb: 3 }}>
            <Breadcrumb 
              items={[
                { 
                  label: 'Artículos', 
                  href: '/articulos',
                  icon: 'ri-article-line'
                },
                { 
                  label: 'Ver artículo',
                  icon: 'ri-eye-line'
                }
              ]}
              currentPage={article.title}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
          </Box>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Article Info */}
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
                <Typography variant='body2'>{getCategoryName(article.category)}</Typography>
              </Box>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <Box>
                  <Typography variant='subtitle2' color='text.secondary' sx={{ mb: 1 }}>
                    Etiquetas
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {article.tags.map(tag => (
                      <Chip key={tag.id} label={tag.name} size='small' variant='outlined' />
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

            {/* Actions */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant='contained'
                href={`/articulos/editar/${article.id}`}
                startIcon={<i className='ri-pencil-line' />}
                fullWidth
              >
                Editar Artículo
              </Button>
              <Button
                variant='outlined'
                href='/articulos'
                startIcon={<i className='ri-arrow-left-line' />}
                fullWidth
              >
                Volver a la Lista
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

// Componente wrapper con Suspense
export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <VerArticuloPorSlugPage params={params} />
    </Suspense>
  )
}
