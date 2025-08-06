'use client'

import React from 'react'
import { useArticles } from '@/hooks/useArticles'
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  Button,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

/**
 * Ejemplo de uso de la arquitectura de servicios HTTP
 * 
 * Este componente demuestra cómo usar el hook useArticles
 * con la respuesta real de la API que incluye:
 * - data: array de artículos
 * - meta: información de paginación
 */
const ArticlesExample: React.FC = () => {
  const { 
    articles, 
    total, 
    page, 
    limit, 
    totalPages,
    loading, 
    error, 
    fetchArticles,
    createArticle,
    deleteArticle,
    clearError 
  } = useArticles()

  const handleLoadMore = () => {
    fetchArticles({ page: page + 1 })
  }

  const handleCreateExample = async () => {
    const newArticle = await createArticle({
      title: 'Artículo de ejemplo',
      content: '<p>Este es un artículo de ejemplo creado desde el frontend</p>',
      summary: 'Resumen del artículo de ejemplo',
      metaKeywords: 'ejemplo, artículo',
      metaDescription: 'Descripción del artículo de ejemplo'
    })

    if (newArticle) {
      console.log('Artículo creado:', newArticle)
    }
  }

  const handleDeleteExample = async (id: string) => {
    const success = await deleteArticle(id)
    if (success) {
      console.log('Artículo eliminado:', id)
    }
  }

  if (loading && articles.length === 0) {
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

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Ejemplo de Artículos
      </Typography>
      
      <Box mb={3}>
        <Typography variant="body1" color="text.secondary">
          Total de artículos: {total} | Página {page} de {totalPages}
        </Typography>
      </Box>

      <Box mb={3}>
        <Button 
          variant="contained" 
          onClick={handleCreateExample}
          sx={{ mr: 2 }}
        >
          Crear Artículo de Ejemplo
        </Button>
        
        {page < totalPages && (
          <Button 
            variant="outlined" 
            onClick={handleLoadMore}
          >
            Cargar Más
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {articles.map((article) => (
          <Grid item xs={12} md={6} lg={4} key={article.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {article.title}
                </Typography>
                
                <Box mb={2}>
                  <Chip 
                    label={article.isPublished ? 'Publicado' : 'Borrador'}
                    color={article.isPublished ? 'success' : 'warning'}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip 
                    label={article.category.label}
                    variant="outlined"
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {article.summary ? 
                    article.summary.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : 
                    'Sin descripción'
                  }
                </Typography>

                <Box mb={2}>
                  <Typography variant="caption" color="text.secondary">
                    Autor: {article.author.name}
                  </Typography>
                  <br />
                  <Typography variant="caption" color="text.secondary">
                    Creado: {format(new Date(article.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                  </Typography>
                </Box>

                <Box>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    sx={{ mr: 1 }}
                    onClick={() => console.log('Ver artículo:', article.slug)}
                  >
                    Ver
                  </Button>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    sx={{ mr: 1 }}
                    onClick={() => console.log('Editar artículo:', article.id)}
                  >
                    Editar
                  </Button>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    color="error"
                    onClick={() => handleDeleteExample(article.id)}
                  >
                    Eliminar
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {articles.length === 0 && !loading && (
        <Typography variant="body1" color="text.secondary" align="center" p={3}>
          No se encontraron artículos
        </Typography>
      )}
    </Box>
  )
}

export default ArticlesExample 