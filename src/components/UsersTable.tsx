import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Box,
  TablePagination,
  Tooltip,
} from '@mui/material';

import { User } from '@/services/users.service';

interface UsersTableProps {
  users: User[];
  loading: boolean;
  meta: any;
  currentUserId?: string;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onView: (user: User) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  loading,
  meta,
  currentUserId,
  onEdit,
  onDelete,
  onView,
  onPageChange,
  onLimitChange,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    onPageChange(newPage + 1);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value, 10);
    setRowsPerPage(newLimit);
    setPage(0);
    onLimitChange(newLimit);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'error';
      case 'EDITOR':
        return 'primary';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <Typography>Cargando usuarios...</Typography>
      </Box>
    );
  }

  if (users.length === 0) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <Typography>No se encontraron usuarios</Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Artículos</TableCell>
              <TableCell>Fecha de Creación</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow hover key={user.id}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2" fontWeight="medium">
                      {user.name}
                    </Typography>
                    {currentUserId === user.id && (
                      <Chip
                        label="Tú"
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color={getRoleColor(user.role)}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {user.articles?.length || 0} artículos
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(user.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Tooltip title="Ver detalles">
                      <IconButton
                        size="small"
                        onClick={() => onView(user)}
                        color="primary"
                      >
                        <i className="ri-eye-line" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar usuario">
                      <IconButton
                        size="small"
                        onClick={() => onEdit(user)}
                        color="warning"
                      >
                        <i className="ri-pencil-line" />
                      </IconButton>
                    </Tooltip>
                    {currentUserId !== user.id && (
                      <Tooltip title={user.articles && user.articles.length > 0 ? "Desactivar usuario" : "Eliminar usuario"}>
                        <IconButton
                          size="small"
                          onClick={() => onDelete(user)}
                          color={user.articles && user.articles.length > 0 ? "warning" : "error"}
                        >
                          <i className={user.articles && user.articles.length > 0 ? "ri-user-unfollow-line" : "ri-delete-bin-line"} />
                        </IconButton>
                      </Tooltip>
                    )}
                    {currentUserId === user.id && (
                      <Tooltip title="No puedes eliminar o desactivar tu propia cuenta">
                        <IconButton
                          size="small"
                          disabled
                          color="default"
                        >
                          <i className="ri-shield-line" />
                        </IconButton>
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                          Tu cuenta
                        </Typography>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {meta && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={meta.totalItems}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      )}
    </Paper>
  );
};

export default UsersTable;
