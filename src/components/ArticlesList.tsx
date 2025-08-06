'use client'

import React from 'react'
import { useArticles } from '@/hooks/useArticles'
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material'
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Visibility as VisibilityIcon 
} from '@mui/icons-material'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface ArticlesListProps {
  onEdit?: (articleId: string) => void
  onView?: (articleId: string) => void
  onDelete?: (articleId: string) => void
}

const ArticlesList: React.FC<ArticlesListProps> = ({ 
  onEdit, 
  onView, 
  onDelete 
}) => {
  const { 
    articles, 
    loading, 
    error, 
    deleteArticle,
    clearError 
  } = useArticles()

  const handleDelete = async (articleId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este artículo?')) {
      const success = await deleteArticle(articleId)
      if (success && onDelete) {
        onDelete(articleId)
      }
    }
  }

  const getStatusColor = (isPublished: boolean) => {
    return isPublished ? 'success' : 'warning'
  }

  const getStatusText = (isPublished: boolean) => {
    return isPublished ? 'Publicado' : 'Borrador'
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" onClose={clearError}>
        {error.message}
      </Alert>
    )
  }

  if (articles.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" p={3}>
        No se encontraron artículos
      </Typography>
    )
  }

  return (
    <List>
      {articles.map((article) => (
        <ListItem key={article.id} divider>
          <ListItemText
            primary={
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="subtitle1" component="span">
                  {article.title}
                </Typography>
                <Chip
                  label={getStatusText(article.isPublished)}
                  color={getStatusColor(article.isPublished) as any}
                  size="small"
                />
              </Box>
            }
            secondary={
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {article.summary || 'Sin descripción'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Creado: {format(new Date(article.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                  {article.isPublished && (
                    <> | Publicado</>
                  )}
                </Typography>
              </Box>
            }
          />
          <ListItemSecondaryAction>
            <Box display="flex" gap={0.5}>
              {onView && (
                <IconButton
                  edge="end"
                  size="small"
                  onClick={() => onView(article.id)}
                  title="Ver artículo"
                >
                  <VisibilityIcon />
                </IconButton>
              )}
              {onEdit && (
                <IconButton
                  edge="end"
                  size="small"
                  onClick={() => onEdit(article.id)}
                  title="Editar artículo"
                >
                  <EditIcon />
                </IconButton>
              )}
              <IconButton
                edge="end"
                size="small"
                onClick={() => handleDelete(article.id)}
                title="Eliminar artículo"
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  )
}

export default ArticlesList 