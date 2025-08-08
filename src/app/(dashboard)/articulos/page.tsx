'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

// MUI Imports
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import TablePagination from '@mui/material/TablePagination'

// Custom hooks and services
import { useArticles } from '@/hooks/useArticles'
import { useCategories } from '@/hooks/useCategories'

// Components
import type { ViewMode } from '@/components/ArticlesViewToggle'
import ArticlesViewToggle from '@/components/ArticlesViewToggle'
import ArticlesListView from '@/components/ArticlesListView'
import ArticlesGridView from '@/components/ArticlesGridView'
import type { ArticlesFiltersState } from '@/components/ArticlesFilters'
import ArticlesFilters from '@/components/ArticlesFilters'

const ArticulosPage = () => {
  const router = useRouter()

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
    clearError
  } = useArticles()

  const { categories: categoriesData, loading: categoriesLoading } = useCategories()

  // const { getSessionInfo, logout } = useAuth()

  const [viewMode, setViewMode] = useState<ViewMode>('list')

  const [filters, setFilters] = useState<ArticlesFiltersState>({
    keywordSearch: '',
    titleSearch: '',
    summarySearch: '',
    contentSearch: '',
    isPublished: '',
    categoryId: '',
    authorId: '',
    dateFrom: null,
    dateTo: null,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })

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
    const apiFilters: any = {
      page: 1,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder
    }

    // Agregar filtros solo si tienen valor
    if (filters.keywordSearch) apiFilters.search = filters.keywordSearch
    if (filters.titleSearch) apiFilters.titleSearch = filters.titleSearch
    if (filters.summarySearch) apiFilters.summarySearch = filters.summarySearch
    if (filters.contentSearch) apiFilters.contentSearch = filters.contentSearch
    if (filters.isPublished) apiFilters.isPublished = filters.isPublished === 'true'
    if (filters.categoryId) apiFilters.categoryId = filters.categoryId
    if (filters.authorId) apiFilters.authorId = filters.authorId
    if (filters.dateFrom) apiFilters.dateFrom = filters.dateFrom.toISOString()
    if (filters.dateTo) apiFilters.dateTo = filters.dateTo.toISOString()

    fetchArticles(apiFilters)
  }

  // Limpiar filtros
  const handleClearFilters = () => {
    setFilters({
      keywordSearch: '',
      titleSearch: '',
      summarySearch: '',
      contentSearch: '',
      isPublished: '',
      categoryId: '',
      authorId: '',
      dateFrom: null,
      dateTo: null,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })
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

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant='h4' component='h1'>
          Artículos
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ArticlesViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          <Button
            variant='contained'
            startIcon={<i className='ri-folder-line' />}
            onClick={() => router.push('/articulos/crear')}
          >
            Nuevo Artículo
          </Button>
        </Box>
      </Box>

      {/* Filtros Avanzados */}
      <ArticlesFilters
        filters={filters}
        onFiltersChange={setFilters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        loading={loading || categoriesLoading}
        categories={categoriesData}
        authors={[]} // TODO: Obtener autores desde la API
      />

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
              onEdit={id => router.push(`/articulos/editar/${id}`)}
              onView={slug => router.push(`/articulos/ver/${slug}`)}
              onDelete={handleDeleteArticle}
              onPublish={handlePublishArticle}
              onUnpublish={handleUnpublishArticle}
            />
          ) : (
            <ArticlesGridView
              articles={articles}
              onEdit={id => router.push(`/articulos/editar/${id}`)}
              onView={slug => router.push(`/articulos/ver/${slug}`)}
              onDelete={handleDeleteArticle}
              onPublish={handlePublishArticle}
              onUnpublish={handleUnpublishArticle}
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
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
            />
          </Box>
        </>
      )}
    </Box>
  )
}

export default ArticulosPage
