'use client'

import React from 'react'
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Typography,
  Box,
  Chip,
  IconButton,
  Avatar,
  Tooltip
} from '@mui/material'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Article } from '@/services/articles.service'

interface ArticlesListViewProps {
  articles: Article[]
  onEdit?: (articleId: string) => void
  onView?: (articleId: string) => void
  onDelete?: (articleId: string) => void
  onPublish?: (articleId: string) => void
  onUnpublish?: (articleId: string) => void
  onArchive?: (articleId: string) => void
}

const ArticlesListView: React.FC<ArticlesListViewProps> = ({
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
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 300 }}>Artículo</TableCell>
              <TableCell sx={{ minWidth: 100 }}>Estado</TableCell>
              <TableCell sx={{ minWidth: 120 }}>Categoría</TableCell>
              <TableCell sx={{ minWidth: 120 }}>Autor</TableCell>
              <TableCell sx={{ minWidth: 120 }}>Fecha de creación</TableCell>
              <TableCell align="center" sx={{ minWidth: 150 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {articles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No se encontraron artículos
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              articles.map((article) => (
                <TableRow key={article.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      {/* Imagen de portada */}
                      <Box
                        sx={{
                          width: 60,
                          height: 40,
                          borderRadius: 1,
                          background: article.coverImage 
                            ? `url(https://res.cloudinary.com/ddqh0mkx9/image/upload/f_webp,w_100/${article.coverImage}) center/cover`
                            : 'linear-gradient(45deg, #f5f5f5 30%, #e0e0e0 90%)',
                          flexShrink: 0
                        }}
                      />
                      
                      {/* Información del artículo */}
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: 600,
                            mb: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {article.title}
                        </Typography>
                        {article.summary && (
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              lineHeight: 1.4
                            }}
                          >
                            {truncateText(article.summary, 100)}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      label={getStatusText(article.isPublished)}
                      color={getStatusColor(article.isPublished) as any}
                      size="small"
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      label={article.category.label}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24 }}>
                        <i className="ri-user-line" />
                      </Avatar>
                      <Typography variant="body2">
                        {article.author.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2">
                      {format(new Date(article.createdAt), 'dd/MM/yyyy', { locale: es })}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(article.createdAt), 'HH:mm', { locale: es })}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                      {onView && (
                        <Tooltip title="Ver artículo">
                          <IconButton
                            size="small"
                            onClick={() => onView(article.id)}
                            color="primary"
                          >
                            <i className="ri-eye-line" />
                          </IconButton>
                        </Tooltip>
                      )}
                      
                      {onEdit && (
                        <Tooltip title="Editar artículo">
                          <IconButton
                            size="small"
                            onClick={() => onEdit(article.id)}
                            color="primary"
                          >
                            <i className="ri-pencil-line" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {!article.isPublished && onPublish && (
                        <Tooltip title="Publicar">
                          <IconButton
                            size="small"
                            onClick={() => onPublish(article.id)}
                            color="success"
                          >
                            <i className="ri-eye-line" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {article.isPublished && onUnpublish && (
                        <Tooltip title="Despublicar">
                          <IconButton
                            size="small"
                            onClick={() => onUnpublish(article.id)}
                            color="warning"
                          >
                            <i className="ri-eye-off-line" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {onArchive && (
                        <Tooltip title="Archivar">
                          <IconButton
                            size="small"
                            onClick={() => onArchive(article.id)}
                            color="default"
                          >
                            <i className="ri-archive-line" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {onDelete && (
                        <Tooltip title="Eliminar">
                          <IconButton
                            size="small"
                            onClick={() => onDelete(article.id)}
                            color="error"
                          >
                            <i className="ri-delete-bin-line" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default ArticlesListView 