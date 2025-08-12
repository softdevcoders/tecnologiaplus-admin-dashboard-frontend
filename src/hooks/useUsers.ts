import { useState, useCallback } from 'react';
import { usersService, User, CreateUserDto, UpdateUserDto, UsersFilters, UsersResponse } from '@/services/users.service';
import { useAuth } from './useAuth';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<UsersResponse['meta'] | null>(null);
  const { getSessionInfo } = useAuth();
  const currentUser = getSessionInfo().user;

  const fetchUsers = useCallback(async (filters: UsersFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await usersService.findAll(filters);
      setUsers(response.data);
      setMeta(response.meta);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  }, []);

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
      return newUser;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al crear usuario');
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentUser?.role]);

  const updateUser = useCallback(async (id: string, updateUserDto: UpdateUserDto): Promise<User | null> => {
    try {
      setLoading(true);
      setError(null);
      
      // Verificar que solo los admins puedan actualizar usuarios
      if (currentUser?.role !== 'ADMIN') {
        throw new Error('No tienes permisos para actualizar usuarios');
      }

      const updatedUser = await usersService.update(id, updateUserDto);
      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
      return updatedUser;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al actualizar usuario');
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentUser?.role]);

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
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al cambiar estado del usuario');
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUser?.role, currentUser?.id]);

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
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al eliminar usuario');
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUser?.role, currentUser?.id]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

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
    canManageUsers: currentUser?.role === 'ADMIN',
    currentUser,
  };
};
