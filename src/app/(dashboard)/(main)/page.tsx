'use client'

import { Box, Typography, Grid, Card, CardContent } from '@mui/material'

import Breadcrumb from '@/components/Breadcrumb'
import { useDashboardStats } from '@/hooks/useDashboardStats'

export default function DashboardPage() {
  const { totalArticles, publishedArticles, draftArticles, totalCategories, loading } = useDashboardStats()

  // Obtener la hora actual para el saludo
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Buenos días'
    if (hour < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[]}
        currentPage="Panel de control"
      />

      {/* Mensaje de bienvenida simple */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 300, color: 'text.primary' }}>
          {getGreeting()}
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400 }}>
          Bienvenido al panel de administración
        </Typography>
      </Box>

      {/* Estadísticas reales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
                {loading ? '...' : totalArticles}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Artículos
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 1, color: 'success.main' }}>
                {loading ? '...' : publishedArticles}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Artículos publicados
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 1, color: 'warning.main' }}>
                {loading ? '...' : draftArticles}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Artículos borradores
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Acciones principales */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 500, mb: 3 }}>
                Acciones rápidas
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2, 
                    p: 2, 
                    borderRadius: 1, 
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': { 
                      bgcolor: 'action.hover',
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  <Box sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: '50%', 
                    bgcolor: 'primary.main', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <i className="ri-add-line" style={{ fontSize: '1.2rem' }} />
                  </Box>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Crear artículo
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Publicar nuevo contenido
                    </Typography>
                  </Box>
                </Box>
                
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2, 
                    p: 2, 
                    borderRadius: 1, 
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': { 
                      bgcolor: 'action.hover',
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  <Box sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: '50%', 
                    bgcolor: 'primary.main', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <i className="ri-folder-line" style={{ fontSize: '1.2rem' }} />
                  </Box>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Gestionar categorías
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Organizar contenido
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 500, mb: 3 }}>
                Resumen de contenido
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  p: 2, 
                  borderRadius: 1, 
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider'
                }}>
                  <Typography variant="body1">
                    Artículos totales
                  </Typography>
                  <Typography variant="body2" color="primary.main" sx={{ fontWeight: 500 }}>
                    {loading ? '...' : totalArticles}
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  p: 2, 
                  borderRadius: 1, 
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider'
                }}>
                  <Typography variant="body1">
                    Categorías
                  </Typography>
                  <Typography variant="body2" color="primary.main" sx={{ fontWeight: 500 }}>
                    {loading ? '...' : totalCategories}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
