'use client'

import React from 'react'
import { 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Box, 
  Chip,
  IconButton,
  Avatar,
  Divider
} from '@mui/material'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Article } from '@/services/articles.service'

interface ArticlesGridViewProps {
  articles: Article[]
  onEdit?: (articleId: string) => void
  onView?: (articleId: string) => void
  onDelete?: (articleId: string) => void
  onPublish?: (articleId: string) => void
  onUnpublish?: (articleId: string) => void
  onArchive?: (articleId: string) => void
}

const ArticlesGridView: React.FC<ArticlesGridViewProps> = ({
  articles,
  onEdit,
  onView,
  onDelete,
  onPublish,
  onUnpublish,
  onArchive
}) => {
  const getStatusColor = (isPublished: boolean) => {
    return isPublished ? 'success' : 'warning'
  }

  const getStatusText = (isPublished: boolean) => {
    return isPublished ? 'Publicado' : 'Borrador'
  }

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return ''
    const cleanText = text.replace(/<[^>]*>/g, '')
    return cleanText.length > maxLength 
      ? cleanText.substring(0, maxLength) + '...' 
      : cleanText
  }

  return (
    <Grid container spacing={3}>
      {articles.map((article) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={article.id}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
              }
            }}
          >
            {/* Header con imagen de portada */}
            <Box
              sx={{
                height: 140,
                background: article.coverImage 
                  ? `url(https://res.cloudinary.com/ddqh0mkx9/image/upload/f_webp,w_500/${article.coverImage}) center/cover`
                  : 'linear-gradient(45deg, #f5f5f5 30%, #e0e0e0 90%)',
                display: 'flex',
                alignItems: 'flex-end',
                position: 'relative'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 1
                }}
              >
                <Chip
                  label={getStatusText(article.isPublished)}
                  color={getStatusColor(article.isPublished) as any}
                  size="small"
                />
              </Box>
              <Box
                sx={{
                  width: '100%',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                  p: 1
                }}
              >
                <Chip
                  label={article.category.label}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    color: 'white', 
                    borderColor: 'white',
                    '& .MuiChip-label': { color: 'white' }
                  }}
                />
              </Box>
            </Box>

            <CardContent sx={{ flexGrow: 1, p: 2 }}>
              {/* Título */}
              <Typography 
                variant="h6" 
                component="h3" 
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  lineHeight: 1.3,
                  mb: 1
                }}
              >
                {article.title}
              </Typography>

              {/* Resumen */}
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mb: 2,
                  lineHeight: 1.5
                }}
              >
                {truncateText(article.summary, 120)}
              </Typography>

              <Divider sx={{ my: 1 }} />

              {/* Información del autor y fecha */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                  <i className="ri-user-line" />
                </Avatar>
                <Typography variant="caption" color="text.secondary">
                  {article.author.name}
                </Typography>
              </Box>

              <Typography variant="caption" color="text.secondary">
                {format(new Date(article.createdAt), 'dd/MM/yyyy', { locale: es })}
              </Typography>
            </CardContent>

            {/* Acciones */}
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {onView && (
                  <IconButton
                    size="small"
                    onClick={() => onView(article.id)}
                    title="Ver artículo"
                    color="primary"
                  >
                    <i className="ri-eye-line" />
                  </IconButton>
                )}
                
                {onEdit && (
                  <IconButton
                    size="small"
                    onClick={() => onEdit(article.id)}
                    title="Editar artículo"
                    color="primary"
                  >
                    <i className="ri-pencil-line" />
                  </IconButton>
                )}

                {!article.isPublished && onPublish && (
                  <IconButton
                    size="small"
                    onClick={() => onPublish(article.id)}
                    title="Publicar"
                    color="success"
                  >
                    <i className="ri-eye-line" />
                  </IconButton>
                )}

                {article.isPublished && onUnpublish && (
                  <IconButton
                    size="small"
                    onClick={() => onUnpublish(article.id)}
                    title="Despublicar"
                    color="warning"
                  >
                    <i className="ri-eye-off-line" />
                  </IconButton>
                )}

                {onArchive && (
                  <IconButton
                    size="small"
                    onClick={() => onArchive(article.id)}
                    title="Archivar"
                    color="default"
                  >
                    <i className="ri-archive-line" />
                  </IconButton>
                )}

                {onDelete && (
                  <IconButton
                    size="small"
                    onClick={() => onDelete(article.id)}
                    title="Eliminar"
                    color="error"
                  >
                    <i className="ri-delete-bin-line" />
                  </IconButton>
                )}
              </Box>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default ArticlesGridView 