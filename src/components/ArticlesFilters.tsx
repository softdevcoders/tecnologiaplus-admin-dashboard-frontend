import React, { useState } from 'react'
import {
  Card,
  CardContent,
  Collapse,
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  IconButton,
  Chip,
  Divider,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { es } from 'date-fns/locale'

// Tipos para los filtros
export interface ArticlesFiltersState {
  // Búsqueda por palabras clave
  keywordSearch: string
  
  // Filtros específicos
  titleSearch: string
  summarySearch: string
  contentSearch: string
  
  // Filtros de estado y categoría
  isPublished: string
  categoryId: string
  
  // Filtros de autor
  authorId: string
  
  // Filtros de fecha
  dateFrom: Date | null
  dateTo: Date | null
  
  // Ordenamiento
  sortBy: string
  sortOrder: string
}

interface ArticlesFiltersProps {
  filters: ArticlesFiltersState
  onFiltersChange: (filters: ArticlesFiltersState) => void
  onApplyFilters: () => void
  onClearFilters: () => void
  categories?: Array<{ id: string; label: string }>
  authors?: Array<{ id: string; name: string }>
  loading?: boolean
}

const ArticlesFilters: React.FC<ArticlesFiltersProps> = ({
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
  categories = [],
  authors = [],
  loading = false,
}) => {
  const [expanded, setExpanded] = useState(false)

  const handleFilterChange = (field: keyof ArticlesFiltersState, value: any) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    })
  }

  const handleClearFilters = () => {
    onClearFilters()
    setExpanded(false)
  }

  const hasActiveFilters = () => {
    return Object.values(filters).some(value => 
      value !== '' && value !== null && value !== undefined
    )
  }

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value !== '' && value !== null && value !== undefined
    ).length
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        {/* Header con filtros básicos */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Buscar artículos"
              value={filters.keywordSearch}
              onChange={(e) => handleFilterChange('keywordSearch', e.target.value)}
              placeholder="Buscar en título, resumen y contenido..."
              InputProps={{
                startAdornment: (
                  <Box component="span" sx={{ mr: 1, color: 'text.secondary' }}>
                    <i className="ri-search-line" />
                  </Box>
                ),
              }}
              onKeyPress={(e) => e.key === 'Enter' && onApplyFilters()}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={filters.isPublished}
                label="Estado"
                onChange={(e) => handleFilterChange('isPublished', e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="true">Publicados</MenuItem>
                <MenuItem value="false">Borradores</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                key={`categories-select-${categories.length}`}
                value="all"
                label="Categoría"
                onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                displayEmpty
              >
                <MenuItem value="all">
                  Todas las categorías
                </MenuItem>
                {categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.label}
                    </MenuItem> 
                  ))
                ) : (
                  <MenuItem disabled>
                    <em>Cargando categorías...</em>
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={onApplyFilters}
                disabled={loading}
                startIcon={<i className="ri-filter-line" />}
                fullWidth
              >
                Aplicar
              </Button>

              <IconButton
                onClick={() => setExpanded(!expanded)}
                sx={{ 
                  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s'
                }}
              >
                <i className="ri-arrow-down-s-line" />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Indicador de filtros activos */}
        {hasActiveFilters() && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Chip
              label={`${getActiveFiltersCount()} filtro${getActiveFiltersCount() > 1 ? 's' : ''} activo${getActiveFiltersCount() > 1 ? 's' : ''}`}
              color="primary"
              size="small"
              variant="outlined"
            />
            <Button
              size="small"
              onClick={handleClearFilters}
              sx={{ ml: 1 }}
            >
              Limpiar todos
            </Button>
          </Box>
        )}

        {/* Filtros avanzados */}
        <Collapse in={expanded}>
          <Divider sx={{ my: 2 }} />
          
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <Grid container spacing={3}>
              {/* Búsqueda específica */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                  Búsqueda específica
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Buscar en título"
                  value={filters.titleSearch}
                  onChange={(e) => handleFilterChange('titleSearch', e.target.value)}
                  placeholder="Palabras clave en el título..."
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Buscar en resumen"
                  value={filters.summarySearch}
                  onChange={(e) => handleFilterChange('summarySearch', e.target.value)}
                  placeholder="Palabras clave en el resumen..."
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Buscar en contenido"
                  value={filters.contentSearch}
                  onChange={(e) => handleFilterChange('contentSearch', e.target.value)}
                  placeholder="Palabras clave en el contenido..."
                />
              </Grid>

              {/* Filtros de autor */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                  Filtros por autor
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Autor</InputLabel>
                  <Select
                    value={filters.authorId}
                    label="Autor"
                    onChange={(e) => handleFilterChange('authorId', e.target.value)}
                  >
                    <MenuItem value="">Todos los autores</MenuItem>
                    {authors.map((author) => (
                      <MenuItem key={author.id} value={author.id}>
                        {author.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Filtros de fecha */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                  Rango de fechas
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Fecha desde"
                  value={filters.dateFrom}
                  onChange={(date) => handleFilterChange('dateFrom', date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      placeholder: "Seleccionar fecha inicial..."
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Fecha hasta"
                  value={filters.dateTo}
                  onChange={(date) => handleFilterChange('dateTo', date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      placeholder: "Seleccionar fecha final..."
                    }
                  }}
                />
              </Grid>

              {/* Ordenamiento */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                  Ordenamiento
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Ordenar por</InputLabel>
                  <Select
                    value={filters.sortBy}
                    label="Ordenar por"
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  >
                    <MenuItem value="createdAt">Fecha de creación</MenuItem>
                    <MenuItem value="updatedAt">Fecha de actualización</MenuItem>
                    <MenuItem value="title">Título</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Orden</InputLabel>
                  <Select
                    value={filters.sortOrder}
                    label="Orden"
                    onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                  >
                    <MenuItem value="desc">Descendente</MenuItem>
                    <MenuItem value="asc">Ascendente</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Botones de acción */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={handleClearFilters}
                    startIcon={<i className="ri-refresh-line" />}
                  >
                    Limpiar filtros
                  </Button>
                  <Button
                    variant="contained"
                    onClick={onApplyFilters}
                    disabled={loading}
                    startIcon={<i className="ri-filter-line" />}
                  >
                    Aplicar filtros
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </LocalizationProvider>
        </Collapse>
      </CardContent>
    </Card>
  )
}

export default ArticlesFilters 