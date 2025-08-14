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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'

import type { Article } from '@/services/articles.service'
import { canDeleteArticle } from '@/utils/permissions'

interface ArticlesListViewProps {
  articles: Article[]
  onEdit?: (articleSlug: string) => void
  onView?: (articleSlug: string) => void
  onDelete?: (articleId: string) => void
  onPublish?: (articleId: string) => void
  onUnpublish?: (articleId: string) => void
  currentUser?: {
    id: string
    role: string
  }
}

const ArticlesListView: React.FC<ArticlesListViewProps> = ({
  articles,
  onEdit,
  onView,
  onDelete,
  onPublish,
  onUnpublish,
  currentUser
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [selectedArticleId, setSelectedArticleId] = React.useState<string | null>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, articleId: string) => {
    setAnchorEl(event.currentTarget)
    setSelectedArticleId(articleId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedArticleId(null)
  }

  const handleAction = (action: () => void) => {
    action()
    handleMenuClose()
  }

  const getStatusColor = (isPublished: boolean) => {
    return isPublished ? 'success' : 'warning'
  }

  const getStatusText = (isPublished: boolean) => {
    return isPublished ? 'Publicado' : 'Borrador'
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align='center' sx={{ minWidth: 300 }}>
                Artículo
              </TableCell>
              <TableCell align='center' sx={{ minWidth: 100 }}>
                Estado
              </TableCell>
              <TableCell align='center' sx={{ minWidth: 120 }}>
                Categoría
              </TableCell>
              <TableCell align='center' sx={{ minWidth: 120 }}>
                Autor
              </TableCell>
              <TableCell align='center' sx={{ minWidth: 120, textWrap: 'nowrap' }}>
                Fecha
              </TableCell>
              <TableCell align='center'>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {articles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align='center'>
                  <Typography variant='body2' color='text.secondary'>
                    No se encontraron artículos
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              articles.map(article => {
                if (!article) {
                  console.log('Found undefined article in array');
                  return null;
                }
                return (
                <TableRow key={article.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      {/* Imagen de portada */}
                      <Box
                        sx={{
                          width: 80,
                          height: 60,
                          borderRadius: 1,
                          background: article.coverImage
                            ? `url(https://res.cloudinary.com/ddqh0mkx9/image/upload/f_webp,w_100/${article.coverImage}) center/cover`
                            : 'linear-gradient(45deg, #f5f5f5 30%, #e0e0e0 90%)',
                          flexShrink: 0
                        }}
                      />

                      {/* Información del artículo */}
                      <Box sx={{ flexGrow: 1, minWidth: 0, maxWidth: '30rem' }}>
                        <Typography
                          variant='subtitle1'
                          color='text.primary'
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
                            variant='body2'
                            color='text.secondary'
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              lineHeight: 1.4
                            }}
                            dangerouslySetInnerHTML={{ __html: article.summary }}
                          />
                        )}
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={getStatusText(article.isPublished)}
                      color={getStatusColor(article.isPublished) as any}
                      size='small'
                    />
                  </TableCell>

                  <TableCell>
                    <Chip label={article.category.label} variant='outlined' size='small' />
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant='body2' noWrap>
                        {article?.author?.name}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography variant='body2' align='center'>
                      {format(new Date(article.createdAt), 'dd/MM/yyyy', { locale: es })}
                    </Typography>
                  </TableCell>

                  <TableCell align='center'>
                    <IconButton size='small' onClick={e => handleMenuOpen(e, article.id)} color='primary'>
                      <i className='ri-more-2-fill' />
                    </IconButton>
                    <IconButton 
                      size='small' 
                      component='a'
                      href={`https://tecnologiaplus.com/blog/${article.category.slug}/${article.slug}`}
                      target='_blank'
                      title='Ver artículo' 
                      color='primary'
                    >
                      <i className='ri-external-link-line' />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )})
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Menú de acciones */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        {onView && (
          <MenuItem
            sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
            onClick={() => {
              const article = articles.find(a => a.id === selectedArticleId)
              if (article) {
                handleAction(() => onView(article.slug))
              }
            }}
          >
            <ListItemIcon sx={{ color: 'primary.main' }}>
              <i className='ri-eye-line' />
            </ListItemIcon>
            <ListItemText sx={{ color: 'primary.main' }}>Ver artículo</ListItemText>
          </MenuItem>
        )}

        {onEdit && (
          <MenuItem
            sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
            onClick={() => {
              const article = articles.find(a => a.id === selectedArticleId)
              if (article) {
                handleAction(() => onEdit(article.slug))
              }
            }}
          >
            <ListItemIcon sx={{ color: 'primary.main' }}>
              <i className='ri-pencil-line' />
            </ListItemIcon>
            <ListItemText sx={{ color: 'primary.main' }}>Editar artículo</ListItemText>
          </MenuItem>
        )}

        {selectedArticleId && articles.find(a => a.id === selectedArticleId)?.isPublished === false && onPublish && (
          <MenuItem
            sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
            onClick={() => handleAction(() => onPublish(selectedArticleId))}
          >
            <ListItemIcon sx={{ color: 'success.main' }}>
              <i className='ri-eye-line' />
            </ListItemIcon>
            <ListItemText sx={{ color: 'success.main' }}>Publicar</ListItemText>
          </MenuItem>
        )}

        {selectedArticleId && articles.find(a => a.id === selectedArticleId)?.isPublished === true && onUnpublish && (
          <MenuItem
            sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
            onClick={() => handleAction(() => onUnpublish(selectedArticleId))}
          >
            <ListItemIcon sx={{ color: 'warning.main' }}>
              <i className='ri-eye-off-line' />
            </ListItemIcon>
            <ListItemText sx={{ color: 'warning.main' }}>Retirar</ListItemText>
          </MenuItem>
        )}

        {onDelete && (() => {
          const article = articles.find(a => a.id === selectedArticleId);
          return article && canDeleteArticle(article, currentUser);
        })() && (
          <MenuItem
            sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
            onClick={() => handleAction(() => onDelete(selectedArticleId!))}
          >
            <ListItemIcon sx={{ color: 'error.main' }}>
              <i className='ri-delete-bin-line' />
            </ListItemIcon>
            <ListItemText sx={{ color: 'error.main' }}>Eliminar</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </Paper>
  )
}

export default ArticlesListView
