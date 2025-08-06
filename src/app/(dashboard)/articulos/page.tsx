'use client'

// MUI Imports
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
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

  // Obtener el color del chip según el status
  const getStatusColor = (isPublished: boolean) => {
    return isPublished ? 'success' : 'warning'
  }

  // Obtener el texto del status
  const getStatusText = (isPublished: boolean) => {
    return isPublished ? 'Publicado' : 'Borrador'
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant='h4' component='h1'>
          Artículos
        </Typography>
        <Button
          variant='contained'
          startIcon={<i className='ri-folder-line' />}
          onClick={() => {/* TODO: Navegar a crear artículo */}}
        >
          Nuevo Artículo
        </Button>
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

      {/* Tabla de artículos */}
      {!loading && (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Título</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Autor</TableCell>
                  <TableCell>Fecha de creación</TableCell>
                  <TableCell>Fecha de publicación</TableCell>
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
                  articles.map((article) => (
                    <TableRow key={article.id} hover>
                      <TableCell>
                        <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
                          {article.title}
                        </Typography>
                        {article.summary && (
                          <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
                            {article.summary.length > 100
                              ? `${article.summary.substring(0, 100)}...`
                              : article.summary}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusText(article.isPublished)}
                          color={getStatusColor(article.isPublished) as any}
                          size='small'
                        />
                      </TableCell>
                      <TableCell>{article.author.name}</TableCell>
                      <TableCell>
                        {format(new Date(article.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                      </TableCell>
                      <TableCell>
                        {article.isPublished ? 'Publicado' : '-'}
                      </TableCell>
                      <TableCell align='center'>
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                          <IconButton
                            size='small'
                            onClick={() => {/* TODO: Navegar a editar */}}
                            title='Editar'
                          >
                            <i className='ri-pencil-line' />
                          </IconButton>
                          <IconButton
                            size='small'
                            onClick={() => {/* TODO: Navegar a ver */}}
                            title='Ver'
                          >
                            <i className='ri-eye-line' />
                          </IconButton>
                          {!article.isPublished && (
                            <IconButton
                              size='small'
                              onClick={() => handlePublishArticle(article.id)}
                              title='Publicar'
                              color='success'
                            >
                              <i className='ri-eye-line' />
                            </IconButton>
                          )}
                          {article.isPublished && (
                            <IconButton
                              size='small'
                              onClick={() => handleUnpublishArticle(article.id)}
                              title='Despublicar'
                              color='warning'
                            >
                              <i className='ri-eye-off-line' />
                            </IconButton>
                          )}
                          <IconButton
                            size='small'
                            onClick={() => handleArchiveArticle(article.id)}
                            title='Archivar'
                            color='default'
                          >
                            <i className='ri-archive-line' />
                          </IconButton>
                          <IconButton
                            size='small'
                            onClick={() => handleDeleteArticle(article.id)}
                            title='Eliminar'
                            color='error'
                          >
                            <i className='ri-delete-bin-line' />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Paginación */}
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
        </Paper>
      )}
    </Box>
  )
}

export default ArticulosPage
