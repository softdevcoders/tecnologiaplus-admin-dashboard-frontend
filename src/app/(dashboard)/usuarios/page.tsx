'use client';

import React, { useState, useEffect } from 'react';

import {
  Box,
  Typography,
  Button,
  Alert,
  Snackbar,
  Container,
  Fade,
} from '@mui/material';

import { useUsers } from '@/hooks/useUsers';
import type { User, CreateUserDto, UpdateUserDto } from '@/services/users.service';
import UsersFilters from '@/components/UsersFilters';
import UsersTable from '@/components/UsersTable';
import UserForm from '@/components/UserForm';
import DeleteUserDialog from '@/components/DeleteUserDialog';
import UserViewDialog from '@/components/UserViewDialog';
import AdminGuard from '@/hocs/AdminGuard';

const UsuariosPage = () => {
  const {
    users,
    loading,
    error,
    meta,
    fetchUsers,
    createUser,
    updateUser,
    updateUserStatus,
    deleteUser,
    clearError,
    canManageUsers,
    currentUser,
  } = useUsers();

  // Estados para los diálogos
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    role: undefined as 'ADMIN' | 'EDITOR' | undefined,
  });

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers(filters);
  }, [filters]);

  // Manejadores de eventos
  const handleCreateUser = async (data: CreateUserDto) => {
    const newUser = await createUser(data);
    if (newUser) {
      setShowCreateForm(false);
      // Recargar usuarios para mostrar el nuevo
      fetchUsers(filters);
    }
  };

  const handleEditUser = async (data: UpdateUserDto) => {
    if (selectedUser) {
      const updatedUser = await updateUser(selectedUser.id, data);
      if (updatedUser) {
        setShowEditForm(false);
        setSelectedUser(null);
        // Recargar usuarios para mostrar los cambios
        fetchUsers(filters);
      }
    }
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      const hasArticles = selectedUser.articles && selectedUser.articles.length > 0;
      
      if (hasArticles) {
        // Si tiene artículos, desactivar
        const success = await updateUserStatus(selectedUser.id, 'DEACTIVATED');
        if (success) {
          setShowDeleteDialog(false);
          setSelectedUser(null);
          fetchUsers(filters);
        }
      } else {
        // Si no tiene artículos, eliminar
        const success = await deleteUser(selectedUser.id);
        if (success) {
          setShowDeleteDialog(false);
          setSelectedUser(null);
          fetchUsers(filters);
        }
      }
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setShowEditForm(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setShowViewDialog(true);
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleLimitChange = (limit: number) => {
    setFilters(prev => ({ ...prev, limit, page: 1 }));
  };

  return (
    <AdminGuard>
      <Container maxWidth="xl">
        <Fade in timeout={300}>
          <Box>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Gestión de Usuarios
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Administra los usuarios del sistema y sus permisos
                </Typography>
              </Box>
              
              {canManageUsers && (
                <Button
                  variant="contained"
                  startIcon={<i className="ri-add-line" />}
                  onClick={() => setShowCreateForm(true)}
                  size="large"
                >
                  Crear Usuario
                </Button>
              )}
            </Box>

            {/* Filtros */}
            <UsersFilters
              onFiltersChange={handleFiltersChange}
              loading={loading}
            />

                      {/* Tabla de usuarios */}
          <UsersTable
            users={users}
            loading={loading}
            meta={meta}
            currentUserId={currentUser?.id ?? undefined}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />

            {/* Diálogos */}
            <UserForm
              open={showCreateForm}
              onClose={() => setShowCreateForm(false)}
              onSubmit={async (data: CreateUserDto | UpdateUserDto) => {
                if ('password' in data && data.password) {
                  await handleCreateUser(data as CreateUserDto);
                }
              }}
              loading={loading}
            />

            <UserForm
              open={showEditForm}
              onClose={() => {
                setShowEditForm(false);
                setSelectedUser(null);
              }}
              onSubmit={handleEditUser}
              user={selectedUser}
              isEdit={true}
              loading={loading}
            />

            <DeleteUserDialog
              open={showDeleteDialog}
              onClose={() => {
                setShowDeleteDialog(false);
                setSelectedUser(null);
              }}
              onConfirm={handleDeleteUser}
              user={selectedUser}
              loading={loading}
            />

            <UserViewDialog
              open={showViewDialog}
              onClose={() => {
                setShowViewDialog(false);
                setSelectedUser(null);
              }}
              user={selectedUser}
            />

            {/* Snackbar para errores */}
            <Snackbar
              open={!!error}
              autoHideDuration={6000}
              onClose={clearError}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <Alert onClose={clearError} severity="error" sx={{ width: '100%' }}>
                {error}
              </Alert>
            </Snackbar>
          </Box>
        </Fade>
      </Container>
    </AdminGuard>
  );
};

export default UsuariosPage;
