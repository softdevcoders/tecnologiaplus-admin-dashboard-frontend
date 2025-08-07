'use client'

import React from 'react'
import { Box, Typography, Card, CardContent, CardMedia, Chip, Divider, Avatar, Grid, Paper } from '@mui/material'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface ArticlePreviewProps {
  title: string
  summary: string
  content: string
  coverImage: string
  category?: {
    label: string
    slug: string
  }
  author?: {
    name: string
    email: string
  }
  isPublished: boolean
  tags: string[]
  metaTitle: string
  metaDescription: string
  keywords: string
}

export function ArticlePreview({
  title,
  summary,
  content,
  coverImage,
  category,
  author,
  isPublished,
  tags,
  metaTitle,
  metaDescription,
  keywords
}: ArticlePreviewProps) {
  const currentDate = new Date()

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Vista previa del artículo */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant='h6' sx={{ mb: 2, color: 'primary.main' }}>
          Vista previa del artículo
        </Typography>

        {/* Imagen de portada */}
        {coverImage && (
          <CardMedia
            component='img'
            height='300'
            image={coverImage}
            alt={title}
            sx={{
              borderRadius: 1,
              mb: 2,
              objectFit: 'cover'
            }}
          />
        )}

        {/* Título */}
        <Typography variant='h3' component='h1' sx={{ mb: 2, fontWeight: 'bold' }}>
          {title || 'Título del artículo'}
        </Typography>

        {/* Meta información */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          {category && (
            <Chip label={category.label} color='primary' size='small' icon={<i className='ri-price-tag-3-line' />} />
          )}
          <Chip
            label={isPublished ? 'Publicado' : 'Borrador'}
            color={isPublished ? 'success' : 'warning'}
            size='small'
            icon={<i className={isPublished ? 'ri-eye-line' : 'ri-eye-off-line'} />}
          />
          <Typography variant='body2' color='text.secondary'>
            <i className='ri-time-line' style={{ marginRight: 4 }} />
            {format(currentDate, 'dd MMMM yyyy', { locale: es })}
          </Typography>
        </Box>

        {/* Autor */}
        {author && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Avatar sx={{ width: 32, height: 32 }}>{author.name.charAt(0).toUpperCase()}</Avatar>
            <Typography variant='body2' color='text.secondary'>
              Por {author.name}
            </Typography>
          </Box>
        )}

        {/* Resumen */}
        {summary && (
          <Typography
            variant='h6'
            color='text.secondary'
            sx={{
              mb: 3,
              fontStyle: 'italic',
              lineHeight: 1.6
            }}
          >
            {summary}
          </Typography>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Contenido */}
        <Box
          sx={{
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              mt: 3,
              mb: 2,
              fontWeight: 'bold'
            },
            '& h1': { fontSize: '2rem' },
            '& h2': { fontSize: '1.75rem' },
            '& h3': { fontSize: '1.5rem' },
            '& p': {
              mb: 2,
              lineHeight: 1.8,
              fontSize: '1.1rem'
            },
            '& ul, & ol': {
              mb: 2,
              pl: 3
            },
            '& li': {
              mb: 1,
              lineHeight: 1.6
            },
            '& blockquote': {
              borderLeft: '4px solid',
              borderColor: 'primary.main',
              pl: 2,
              ml: 0,
              fontStyle: 'italic',
              bgcolor: 'grey.50',
              py: 1,
              borderRadius: 1
            },
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              borderRadius: 1,
              my: 2
            }
          }}
          dangerouslySetInnerHTML={{
            __html: content || '<p>El contenido del artículo aparecerá aquí...</p>'
          }}
        />

        {/* Tags */}
        {tags.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant='subtitle2' sx={{ mb: 1 }}>
              Etiquetas:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {tags.map(tag => (
                <Chip
                  key={tag}
                  label={tag}
                  size='small'
                  variant='outlined'
                  icon={<i className='ri-price-tag-3-line' />}
                />
              ))}
            </Box>
          </Box>
        )}
      </Paper>

      {/* Vista previa SEO */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant='h6' sx={{ mb: 2, color: 'primary.main' }}>
          Vista previa SEO
        </Typography>

        <Card variant='outlined' sx={{ mb: 2 }}>
          <CardContent sx={{ p: 2 }}>
            <Typography
              variant='h6'
              sx={{
                color: '#1a0dab',
                mb: 1,
                fontSize: '1.1rem',
                fontWeight: 'normal'
              }}
            >
              {metaTitle || 'Título para motores de búsqueda'}
            </Typography>
            <Typography
              variant='body2'
              sx={{
                color: '#006621',
                mb: 1,
                fontSize: '0.9rem'
              }}
            >
              {window.location.origin}/articulos/
              {title ? title.toLowerCase().replace(/\s+/g, '-') : 'slug-del-articulo'}
            </Typography>
            <Typography
              variant='body2'
              sx={{
                color: '#545454',
                fontSize: '0.9rem',
                lineHeight: 1.4
              }}
            >
              {metaDescription || 'Descripción que aparecerá en los resultados de búsqueda...'}
            </Typography>
          </CardContent>
        </Card>

        {/* Información SEO */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant='subtitle2' sx={{ mb: 1 }}>
              Meta Título: {metaTitle.length}/60
            </Typography>
            <Chip
              label={metaTitle.length > 50 ? 'Muy largo' : metaTitle.length > 30 ? 'Óptimo' : 'Muy corto'}
              color={metaTitle.length > 50 ? 'error' : metaTitle.length > 30 ? 'success' : 'warning'}
              size='small'
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant='subtitle2' sx={{ mb: 1 }}>
              Meta Descripción: {metaDescription.length}/160
            </Typography>
            <Chip
              label={metaDescription.length > 150 ? 'Muy larga' : metaDescription.length > 120 ? 'Óptima' : 'Muy corta'}
              color={metaDescription.length > 150 ? 'error' : metaDescription.length > 120 ? 'success' : 'warning'}
              size='small'
            />
          </Grid>
        </Grid>

        {keywords && (
          <Box sx={{ mt: 2 }}>
            <Typography variant='subtitle2' sx={{ mb: 1 }}>
              Palabras clave:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {keywords.split(',').map((keyword, index) => (
                <Chip key={index} label={keyword.trim()} size='small' variant='outlined' />
              ))}
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  )
}
