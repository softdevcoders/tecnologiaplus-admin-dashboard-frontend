import { useState, useCallback } from 'react';

import { useRouter } from 'next/navigation';

import { usersService, type User, type CreateUserDto, type UpdateUserDto, type UsersFilters, type  UsersResponse } from '@/services/users.service';

import { useAuth } from './useAuth';
import { useNotification } from '@/contexts/NotificationContext';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<UsersResponse['meta'] | null>(null);
  const { getSessionInfo } = useAuth();
  const currentUser = getSessionInfo().user;
  const { showSuccess, showError } = useNotification();
  const router = useRouter();

  const fetchUsers = useCallback(async (filters: UsersFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await usersService.findAll(filters);
      setUsers(response.data);
      setMeta(response.meta);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al cargar usuarios';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const createUser = useCallback(async (createUserDto: CreateUserDto): Promise<User | null> => {
    try {
      setLoading(true);
      setError(null);
      
      // Verificar que solo los admins puedan crear usuarios
      if (currentUser?.role !== 'ADMIN') {
        throw new Error('No tienes permisos para crear usuarios');
      }

      const newUser = await usersService.create(createUserDto);
      setUsers(prev => [newUser, ...prev]);
      showSuccess(`Usuario "${newUser.name}" creado exitosamente`);
      return newUser;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear usuario';
      setError(errorMessage);
      showError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentUser?.role, showSuccess, showError]);

  const updateUser = useCallback(async (id: string, updateUserDto: UpdateUserDto): Promise<User | null> => {
    try {
      setLoading(true);
      setError(null);
      
      // Verificar que solo los admins puedan actualizar usuarios
      if (currentUser?.role !== 'ADMIN') {
        throw new Error('No tienes permisos para actualizar usuarios');
      }

      // Prevenir que un admin se cambie a sí mismo el rol de ADMIN a EDITOR
      if (currentUser?.id === id && currentUser?.role === 'ADMIN' && updateUserDto.role === 'EDITOR') {
        throw new Error('No puedes cambiar tu propio rol de Administrador a Editor por seguridad');
      }

      const updatedUser = await usersService.update(id, updateUserDto);
      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
      
      showSuccess(`Usuario "${updatedUser.name}" actualizado exitosamente`);
      return updatedUser;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar usuario';
      setError(errorMessage);
      showError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentUser?.role, currentUser?.id, showSuccess, showError]);

  const updateUserStatus = useCallback(async (id: string, status: 'ACTIVE' | 'DEACTIVATED'): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // Verificar que solo los admins puedan cambiar el estado de usuarios
      if (currentUser?.role !== 'ADMIN') {
        throw new Error('No tienes permisos para cambiar el estado de usuarios');
      }

      // Verificar que el usuario no se esté desactivando a sí mismo
      if (currentUser.id === id && status === 'DEACTIVATED') {
        throw new Error('No puedes desactivarte a ti mismo');
      }

      const updatedUser = await usersService.updateStatus(id, status);
      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
      const action = status === 'ACTIVE' ? 'activado' : 'desactivado';
      showSuccess(`Usuario "${updatedUser.name}" ${action} exitosamente`);
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cambiar estado del usuario';
      setError(errorMessage);
      showError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUser?.role, currentUser?.id, showSuccess, showError]);

  const deleteUser = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // Verificar que solo los admins puedan eliminar usuarios
      if (currentUser?.role !== 'ADMIN') {
        throw new Error('No tienes permisos para eliminar usuarios');
      }

      // Verificar que el usuario no se esté eliminando a sí mismo
      if (currentUser.id === id) {
        throw new Error('No puedes eliminarte a ti mismo');
      }

      await usersService.remove(id);
      setUsers(prev => prev.filter(user => user.id !== id));
      showSuccess('Usuario eliminado exitosamente');
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar usuario';
      setError(errorMessage);
      showError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUser?.role, currentUser?.id, showSuccess, showError]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Función para verificar si el usuario actual tiene permisos de admin
  const checkAdminPermissions = useCallback(() => {
    const sessionInfo = getSessionInfo();
    const userRole = sessionInfo.user?.role;
    
    if (userRole !== 'ADMIN') {
      showError('No tienes permisos de administrador. Serás redirigido al inicio.');
      setTimeout(() => {
        router.push('/');
      }, 2000);
      return false;
    }
    return true;
  }, [getSessionInfo, showError, router]);

  return {
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
    checkAdminPermissions,
    canManageUsers: currentUser?.role === 'ADMIN',
    currentUser,
  };
};
