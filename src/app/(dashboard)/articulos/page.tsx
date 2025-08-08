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
import { useAuth } from '@/hooks/useAuth'

// Components
import type { ViewMode } from '@/components/ArticlesViewToggle'
import ArticlesViewToggle from '@/components/ArticlesViewToggle'
import ArticlesListView from '@/components/ArticlesListView'
import ArticlesGridView from '@/components/ArticlesGridView'
import type { ArticlesFiltersState } from '@/components/ArticlesFilters'
import ArticlesFilters from '@/components/ArticlesFilters'
import ConfirmDialog from '@/components/ConfirmDialog'
import Breadcrumb from '@/components/Breadcrumb'

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
  const { session } = useAuth()
  const currentUser = session?.user ? {
    id: session.user.id || '',
    role: session.user.role || ''
  } : undefined

  const [viewMode, setViewMode] = useState<ViewMode>('grid')

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

  // Estados para confirmaciones
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    title: string
    message: string
    confirmText: string
    confirmColor: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
    action: (() => void) | null
  }>({
    open: false,
    title: '',
    message: '',
    confirmText: '',
    confirmColor: 'primary',
    action: null
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
    setConfirmDialog({
      open: true,
      title: 'Eliminar Artículo',
      message: '¿Estás seguro de que quieres eliminar este artículo? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      confirmColor: 'error',
      action: async () => {
        await deleteArticle(id)
        setConfirmDialog(prev => ({ ...prev, open: false }))
      }
    })
  }

  const handlePublishArticle = async (id: string) => {
    setConfirmDialog({
      open: true,
      title: 'Publicar Artículo',
      message: '¿Estás seguro de que quieres publicar este artículo? Será visible para todos los usuarios.',
      confirmText: 'Publicar',
      confirmColor: 'success',
      action: async () => {
        await publishArticle(id)
        setConfirmDialog(prev => ({ ...prev, open: false }))
      }
    })
  }

  const handleUnpublishArticle = async (id: string) => {
    setConfirmDialog({
      open: true,
      title: 'Retirar Artículo',
      message: '¿Estás seguro de que quieres retirar este artículo? Ya no será visible para los usuarios.',
      confirmText: 'Retirar',
      confirmColor: 'warning',
      action: async () => {
        await unpublishArticle(id)
        setConfirmDialog(prev => ({ ...prev, open: false }))
      }
    })
  }

  const handleCloseConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, open: false }))
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            label: 'Artículos',
            icon: 'ri-article-line'
          }
        ]}
        currentPage="Lista de artículos"
      />

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
              currentUser={currentUser}
            />
          ) : (
            <ArticlesGridView
              articles={articles}
              onEdit={id => router.push(`/articulos/editar/${id}`)}
              onView={slug => router.push(`/articulos/ver/${slug}`)}
              onDelete={handleDeleteArticle}
              onPublish={handlePublishArticle}
              onUnpublish={handleUnpublishArticle}
              currentUser={currentUser}
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

      {/* Dialog de confirmación */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        confirmColor={confirmDialog.confirmColor}
        onConfirm={confirmDialog.action || (() => {})}
        onCancel={handleCloseConfirmDialog}
      />
    </Box>
  )
}

export default ArticulosPage
