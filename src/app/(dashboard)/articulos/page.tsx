'use client'

// MUI Imports
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import TablePagination from '@mui/material/TablePagination'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
// Custom hooks and services
import { useArticles } from '@/hooks/useArticles'
import { Article } from '@/services/articles.service'

// Components
import ArticlesViewToggle, { ViewMode } from '@/components/ArticlesViewToggle'
import ArticlesListView from '@/components/ArticlesListView'
import ArticlesGridView from '@/components/ArticlesGridView'

// Utils
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useState } from 'react'

const ArticulosPage = () => {
  const {
    articles,
    total,
    page,
    limit,
    loading,
    error,
    fetchArticles,
    deleteArticle,
    publishArticle,
    unpublishArticle,
    archiveArticle,
    clearError,
  } = useArticles()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  // Manejar cambio de página
  const handleChangePage = (event: unknown, newPage: number) => {
    fetchArticles({ page: newPage + 1 })
  }

  // Manejar cambio de límite por página
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    fetchArticles({ page: 1, limit: parseInt(event.target.value, 10) })
  }

  // Aplicar filtros
  const handleApplyFilters = () => {
    fetchArticles({
      page: 1,
      search: searchTerm || undefined,
      isPublished: statusFilter === 'true' ? true : statusFilter === 'false' ? false : undefined,
    })
  }

  // Limpiar filtros
  const handleClearFilters = () => {
    setSearchTerm('')
    setStatusFilter('')
    fetchArticles({ page: 1 })
  }

  // Manejar acciones de artículos
  const handleDeleteArticle = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este artículo?')) {
      await deleteArticle(id)
    }
  }

  const handlePublishArticle = async (id: string) => {
    await publishArticle(id)
  }

  const handleUnpublishArticle = async (id: string) => {
    await unpublishArticle(id)
  }

  const handleArchiveArticle = async (id: string) => {
    await archiveArticle(id)
  }



  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant='h4' component='h1'>
          Artículos
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ArticlesViewToggle 
            viewMode={viewMode} 
            onViewModeChange={setViewMode} 
          />
          <Button
            variant='contained'
            startIcon={<i className='ri-folder-line' />}
            onClick={() => {/* TODO: Navegar a crear artículo */}}
          >
            Nuevo Artículo
          </Button>
        </Box>
      </Box>

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems='center'>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label='Buscar artículos'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='ri-search-line' />
                    </InputAdornment>
                  ),
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={statusFilter}
                  label='Estado'
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value=''>Todos</MenuItem>
                  <MenuItem value='true'>Publicados</MenuItem>
                  <MenuItem value='false'>Borradores</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant='contained' onClick={handleApplyFilters}>
                  Aplicar Filtros
                </Button>
                <Button variant='outlined' onClick={handleClearFilters}>
                  Limpiar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert severity='error' sx={{ mb: 3 }} onClose={clearError}>
          {error.message}
        </Alert>
      )}

      {/* Loading */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Vista de artículos */}
      {!loading && (
        <>
          {viewMode === 'list' ? (
            <ArticlesListView
              articles={articles}
              onEdit={(id) => {/* TODO: Navegar a editar */}}
              onView={(id) => {/* TODO: Navegar a ver */}}
              onDelete={handleDeleteArticle}
              onPublish={handlePublishArticle}
              onUnpublish={handleUnpublishArticle}
              onArchive={handleArchiveArticle}
            />
          ) : (
            <ArticlesGridView
              articles={articles}
              onEdit={(id) => {/* TODO: Navegar a editar */}}
              onView={(id) => {/* TODO: Navegar a ver */}}
              onDelete={handleDeleteArticle}
              onPublish={handlePublishArticle}
              onUnpublish={handleUnpublishArticle}
              onArchive={handleArchiveArticle}
            />
          )}
          
          {/* Paginación */}
          <Box sx={{ mt: 3 }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component='div'
              count={total}
              rowsPerPage={limit}
              page={page - 1}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage='Filas por página:'
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
              }
            />
          </Box>
        </>
      )}
    </Box>
  )
}

export default ArticulosPage
