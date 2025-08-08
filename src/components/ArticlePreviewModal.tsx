'use client'

import React, { useState } from 'react'

import {
  Box,
  Typography,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  IconButton,
  Tooltip
} from '@mui/material'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface ArticlePreviewModalProps {
  open: boolean
  onClose: () => void
  title: string
  summary: string
  content: string
  coverImage: string
  category?: {
    label: string
    slug: string
  }
  isPublished: boolean
  tags: string[]
}

export function ArticlePreviewModal({
  open,
  onClose,
  title,
  summary,
  content,
  coverImage,
  category,
  isPublished,
  tags
}: ArticlePreviewModalProps) {
  const [tabValue, setTabValue] = useState(0)
  const currentDate = new Date()

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const getPreviewStyles = () => {
    const baseStyles = {
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: tabValue === 0 ? 0 : 2,
      overflow: 'hidden',
      boxShadow: tabValue === 0 ? 'none' : '0 4px 20px rgba(0,0,0,0.1)',
      border: tabValue === 0 ? 'none' : '1px solid #e0e0e0'
    }

    switch (tabValue) {
      case 0: // Desktop
        return {
          ...baseStyles,
          maxWidth: '1200px',
          padding: '40px'
        }
      case 1: // Tablet
        return {
          ...baseStyles,
          width: '768px',
          padding: '24px'
        }
      case 2: // Mobile
        return {
          ...baseStyles,
          width: '375px',
          padding: '16px'
        }
      default:
        return baseStyles
    }
  }

  const getTypographyStyles = () => {
    switch (tabValue) {
      case 0: // Desktop
        return {
          title: { fontSize: '2.5rem', mb: 3 },
          summary: { fontSize: '1.25rem', mb: 4 },
          content: { fontSize: '1.1rem' }
        }
      case 1: // Tablet
        return {
          title: { fontSize: '2rem', mb: 2 },
          summary: { fontSize: '1.1rem', mb: 3 },
          content: { fontSize: '1rem' }
        }
      case 2: // Mobile
        return {
          title: { fontSize: '1.5rem', mb: 2 },
          summary: { fontSize: '1rem', mb: 2 },
          content: { fontSize: '0.9rem' }
        }
      default:
        return {
          title: { fontSize: '2.5rem', mb: 3 },
          summary: { fontSize: '1.25rem', mb: 4 },
          content: { fontSize: '1.1rem' }
        }
    }
  }

  const typographyStyles = getTypographyStyles()

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          width: '95vw',
          height: '95vh',
          maxWidth: 'none',
          m: 2
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant='h6'>Vista Previa del Artículo</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label='Desktop' icon={<i className='ri-computer-line' />} iconPosition='start' />
              <Tab label='Tablet' icon={<i className='ri-tablet-line' />} iconPosition='start' />
              <Tab label='Mobile' icon={<i className='ri-smartphone-line' />} iconPosition='start' />
            </Tabs>
            <Tooltip title='Cerrar'>
              <IconButton onClick={onClose} size='small'>
                <i className='ri-close-line' />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
        <Box sx={{ height: '100%', overflow: 'auto', bgcolor: '#f5f5f5', p: 2 }}>
          <Box sx={getPreviewStyles()}>
            {/* Imagen de portada */}
            {coverImage && (
              <Box
                component='img'
                src={coverImage}
                alt={title}
                sx={{
                  height: tabValue === 0 ? 400 : tabValue === 1 ? 300 : 200,
                  borderRadius: 1,
                  mb: 3,
                  objectFit: 'cover',
                  width: '100%'
                }}
              />
            )}

            {/* Título */}
            <Typography
              variant='h1'
              component='h1'
              sx={{
                fontWeight: 'bold',
                ...typographyStyles.title
              }}
            >
              {title || 'Título del artículo'}
            </Typography>

            {/* Meta información */}
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                mb: 3,
                flexWrap: 'wrap',
                flexDirection: tabValue === 2 ? 'column' : 'row',
                alignItems: tabValue === 2 ? 'flex-start' : 'center'
              }}
            >
              {category && (
                <Chip
                  label={category.label}
                  color='primary'
                  size='small'
                  icon={<i className='ri-price-tag-3-line' />}
                />
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

            {/* Resumen */}
            {summary && (
              <Typography
                variant='h6'
                color='text.secondary'
                sx={{
                  fontStyle: 'italic',
                  lineHeight: 1.6,
                  ...typographyStyles.summary
                }}
              >
                {summary}
              </Typography>
            )}

            <Divider sx={{ my: 4 }} />

            {/* Contenido */}
            <Box
              sx={{
                '& h1, & h2, & h3, & h4, & h5, & h6': {
                  mt: 3,
                  mb: 2,
                  fontWeight: 'bold'
                },
                '& h1': { fontSize: tabValue === 0 ? '2rem' : tabValue === 1 ? '1.75rem' : '1.5rem' },
                '& h2': { fontSize: tabValue === 0 ? '1.75rem' : tabValue === 1 ? '1.5rem' : '1.25rem' },
                '& h3': { fontSize: tabValue === 0 ? '1.5rem' : tabValue === 1 ? '1.25rem' : '1.1rem' },
                '& p': {
                  mb: 2,
                  lineHeight: 1.8,
                  ...typographyStyles.content
                },
                '& ul, & ol': {
                  mb: 2,
                  pl: tabValue === 2 ? 2 : 3
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
                },
                '& a': {
                  color: 'primary.main',
                  textDecoration: 'underline',
                  '&:hover': {
                    textDecoration: 'none'
                  }
                }
              }}
              dangerouslySetInnerHTML={{
                __html: content || '<p>El contenido del artículo aparecerá aquí...</p>'
              }}
            />

            {/* Tags */}
            {tags.length > 0 && (
              <Box sx={{ mt: 4 }}>
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
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant='outlined'>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
