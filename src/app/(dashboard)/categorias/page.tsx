'use client'

import { useState, useEffect } from 'react'

import { useSession } from 'next-auth/react'

// MUI Imports
import { Box, Typography, Grid, Card, CardContent, CircularProgress, Alert, IconButton } from '@mui/material'

// Components
import Breadcrumb from '@/components/Breadcrumb'

// Services
import categoriesService, { type Category } from '@/services/categories.service'

const CategoriasPage = () => {
  const { data: session } = useSession()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      if (!session?.accessToken) return

      try {
        setLoading(true)
        setError(null)
        const response = await categoriesService.getCategories()
        
        if (response.success) {
          setCategories(response.data || [])
        } else {
          setError('Error al cargar las categorías')
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        setError('Error al cargar las categorías')
      } finally {
        setLoading(false)
      }
    }

    if (session?.accessToken) {
      fetchCategories()
    }
  }, [session])

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Breadcrumb
          items={[
            {
              label: 'Categorías',
              icon: 'ri-folder-line'
            }
          ]}
          currentPage="Lista de categorías"
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            label: 'Categorías',
            icon: 'ri-folder-line'
          }
        ]}
        currentPage="Lista de categorías"
      />

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant='h4' component='h1'>
          Categorías
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {categories.length} categoría{categories.length !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity='error' sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Categories Grid */}
      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                {/* Category Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant='h6' component='h3' sx={{ fontWeight: 600, mb: 1 }}>
                      {category.label}
                    </Typography>
                    <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                      {category.slug}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton size='small' color='primary' component='a' href={`https://tecnologiaplus.com/blog/${category.slug}`} target='_blank'>
                      <i className='ri-external-link-line' />
                    </IconButton>
                  </Box>
                </Box>

                {/* Description */}
                {category.description && (
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                    {category.description}
                  </Typography>
                )}

                {/* Article Count Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box component='i' className='ri-article-line' sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant='caption' color='text.secondary'>
                    {category.articles.length || 0} artículo{(category.articles.length || 0) !== 1 ? 's' : ''}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {!loading && categories.length === 0 && !error && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Box component='i' className='ri-folder-line' sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant='h6' color='text.secondary' sx={{ mb: 1 }}>
            No hay categorías
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            No se encontraron categorías en el sistema
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default CategoriasPage
