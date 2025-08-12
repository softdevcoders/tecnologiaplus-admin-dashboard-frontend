import React, { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';

import { UsersFilters as UsersFiltersType } from '@/services/users.service';

interface UsersFiltersProps {
  onFiltersChange: (filters: UsersFiltersType) => void;
  loading?: boolean;
  onFiltersApplied?: () => void;
}

const UsersFilters: React.FC<UsersFiltersProps> = ({
  onFiltersChange,
  loading = false,
  onFiltersApplied,
}) => {
  const [filters, setFilters] = useState<UsersFiltersType>({
    page: 1,
    limit: 10,
    search: '',
    role: undefined,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);



  const handleSearchChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      search: value,
    }));
  };

  const handleRoleChange = (value: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      role: value as 'ADMIN' | 'EDITOR' | undefined,
    }));
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      page: 1,
      limit: 10,
      search: '',
      role: undefined,
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    
    // Mostrar toast de éxito si hay callback
    if (onFiltersApplied) {
      onFiltersApplied();
    }
  };

  const handleApplyFilters = () => {
    const filtersToApply = {
      ...filters,
      page: 1, // Reset to first page when applying filters
    };
    onFiltersChange(filtersToApply);
    
    // Mostrar toast de éxito si hay callback
    if (onFiltersApplied) {
      onFiltersApplied();
    }
  };

  const hasActiveFilters = filters.search || filters.role;
  const hasPendingFilters = filters.search !== '' || filters.role !== undefined;

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box display="flex" flexDirection="column" gap={2}>
        {/* Barra de búsqueda principal */}
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            placeholder="Buscar por nombre o email..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && hasPendingFilters) {
                e.preventDefault();
                handleApplyFilters();
              }
            }}
            InputProps={{
              startAdornment: <i className="ri-search-line" style={{ color: 'rgba(0, 0, 0, 0.54)' }} />,
            }}
            sx={{ flexGrow: 1 }}
            disabled={loading}
          />
          
          <Tooltip title="Filtros avanzados">
            <IconButton
              onClick={() => setShowAdvanced(!showAdvanced)}
              color={showAdvanced ? 'primary' : hasPendingFilters ? 'warning' : 'default'}
            >
              <i className="ri-filter-line" />
              {hasPendingFilters && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: 'warning.main',
                  }}
                />
              )}
            </IconButton>
          </Tooltip>

          {hasPendingFilters && (
            <Button
              variant="contained"
              onClick={handleApplyFilters}
              disabled={loading}
              startIcon={<i className="ri-search-line" />}
              size="small"
            >
              Filtrar
            </Button>
          )}

          {hasActiveFilters && (
            <Tooltip title="Limpiar filtros">
              <IconButton
                onClick={handleClearFilters}
                color="error"
                disabled={loading}
              >
                <i className="ri-refresh-line" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Filtros avanzados */}
        {showAdvanced && (
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Filtrar por rol</InputLabel>
              <Select
                value={filters.role || ''}
                label="Filtrar por rol"
                onChange={(e) => handleRoleChange(e.target.value || undefined)}
                disabled={loading}
              >
                <MenuItem value="">Todos los roles</MenuItem>
                <MenuItem value="ADMIN">Administradores</MenuItem>
                <MenuItem value="EDITOR">Editores</MenuItem>
              </Select>
            </FormControl>

            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2" color="text.secondary">
                Mostrando:
              </Typography>
              <FormControl size="small" sx={{ minWidth: 80 }}>
                <Select
                  value={filters.limit}
                  onChange={(e) => {
                    const newLimit = e.target.value as number;
                    setFilters(prev => ({ ...prev, limit: newLimit }));
                    // Aplicar inmediatamente el cambio de límite
                    onFiltersChange({ ...filters, limit: newLimit, page: 1 });
                  }}
                  disabled={loading}
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                </Select>
              </FormControl>
              <Typography variant="text.secondary">
                por página
              </Typography>
            </Box>
          </Box>
        )}

        {/* Información de filtros activos y pendientes */}
        {(hasActiveFilters || hasPendingFilters) && (
          <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
            {hasActiveFilters && (
              <>
                <Typography variant="body2" color="text.secondary">
                  Filtros activos:
                </Typography>
                
                {filters.search && (
                  <Typography variant="body2" color="primary">
                    Búsqueda: "{filters.search}"
                  </Typography>
                )}
                
                {filters.role && (
                  <Typography variant="body2" color="primary">
                    Rol: {filters.role === 'ADMIN' ? 'Administrador' : 'Editor'}
                  </Typography>
                )}
              </>
            )}

            {hasPendingFilters && !hasActiveFilters && (
              <Box display="flex" gap={1} alignItems="center">
                <Typography variant="body2" color="warning.main">
                  ⚠️ Filtros pendientes de aplicar
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleApplyFilters}
                  disabled={loading}
                  startIcon={<i className="ri-search-line" />}
                >
                  Aplicar Filtros
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default UsersFilters;
