'use client'

import React from 'react'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

// Types
import type { Article } from '@/services/articles.service'

// Utils
import { canDeleteArticle } from '@/utils/permissions'

interface ArticlesGridViewProps {
  articles: Article[]
  onEdit?: (articleId: string) => void
  onView?: (articleSlug: string) => void
  onDelete?: (articleId: string) => void
  onPublish?: (articleId: string) => void
  onUnpublish?: (articleId: string) => void
  currentUser?: {
    id: string
    role: string
  }
}

const ArticlesGridView: React.FC<ArticlesGridViewProps> = ({
  articles,
  onEdit,
  onView,
  onDelete,
  onPublish,
  onUnpublish,
  currentUser
}) => {
  // Estado para el menú de acciones
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
    handleMenuClose()
    action()
  }

  const getStatusColor = (isPublished: boolean) => {
    return isPublished ? 'success' : 'warning'
  }

  const getStatusText = (isPublished: boolean) => {
    return isPublished ? 'Publicado' : 'Borrador'
  }

  return (
    <>
      <Grid container spacing={5}>
        {articles.map(article => {
          if (!article) {
            console.log('Found undefined article in grid array');
            return null;
          }
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={article.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out'
                }}
              >
                {/* Header con imagen de portada */}
                <Box
                  sx={{
                    height: 200,
                    background: article.coverImage
                      ? `url(https://res.cloudinary.com/ddqh0mkx9/image/upload/f_webp,w_500/${article.coverImage}) center/cover`
                      : 'linear-gradient(45deg, #f5f5f5 30%, #e0e0e0 90%)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    position: 'relative'
                  }}
                >
                  {/* Acciones */}
                  <Box sx={{ display: 'flex', position: 'absolute', top: 10, right: 10, zIndex: 1 }}>
                    <IconButton 
                      size='small' 
                      onClick={(e) => handleMenuOpen(e, article.id)} 
                      title='Acciones' 
                      color='primary'
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 1) !important',
                          transform: 'scale(1.1)'
                        }
                      }}
                    >
                      <i className='ri-more-2-fill' />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: 'flex', position: 'absolute', top: 10, right: 50, zIndex: 1 }}>
                    <IconButton 
                      size='small' 
                      component='a'
                      href={`https://tecnologiaplus.com/blog/${article.category.slug}/${article.slug}`}
                      target='_blank'
                      title='Ver artículo' 
                      color='primary'
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 1) !important',
                          transform: 'scale(1.1)'
                        }
                      }}
                    >
                      <i className='ri-external-link-line' />
                    </IconButton>
                  </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      zIndex: 1
                    }}
                  >
                    <Chip
                      label={getStatusText(article.isPublished)}
                      color={getStatusColor(article.isPublished) as any}
                      size='small'
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
                      variant='outlined'
                      size='small'
                      sx={{
                        color: 'white',
                        borderColor: 'white',
                        '& .MuiChip-label': { color: 'white' }
                      }}
                    />
                  </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 5 }}>
                  {/* Título */}
                  <Typography
                    variant='h6'
                    component='h3'
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      lineHeight: 1.3,
                      mb: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {article.title}
                  </Typography>

                  {/* Resumen */}
                  {article.summary && (
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      sx={{
                        mb: 2,
                        lineHeight: 1.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                      }}
                      dangerouslySetInnerHTML={{ __html: article.summary }}
                    />
                  )}

                  <Divider sx={{ my: 3 }} />

                  {/* Información del autor y fecha */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box component='i' sx={{ fontSize: 16, color: 'text.secondary' }} className='ri-user-line' /> <Typography variant='caption' fontWeight={600} color='text.primary'>Autor:</Typography> <Typography variant='caption' color='text.secondary'>{article?.author?.name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box component='i' sx={{ fontSize: 16, color: 'text.secondary' }} className='ri-calendar-line' /> <Typography variant='caption' fontWeight={600} color='text.primary'>Fecha de publicación:</Typography> <Typography variant='caption' color='text.secondary'>{format(new Date(article.createdAt), 'dd/MM/yyyy', { locale: es })}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

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
              if (article && onView) {
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
            onClick={() => selectedArticleId && onEdit && handleAction(() => onEdit(selectedArticleId))}
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
            onClick={() => selectedArticleId && onPublish && handleAction(() => onPublish(selectedArticleId))}
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
            onClick={() => selectedArticleId && onUnpublish && handleAction(() => onUnpublish(selectedArticleId))}
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
            onClick={() => selectedArticleId && onDelete && handleAction(() => onDelete(selectedArticleId))}
          >
            <ListItemIcon sx={{ color: 'error.main' }}>
              <i className='ri-delete-bin-line' />
            </ListItemIcon>
            <ListItemText sx={{ color: 'error.main' }}>Eliminar</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  )
}

export default ArticlesGridView
