import React from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
} from '@mui/material';

import type { User } from '@/services/users.service';

interface UserViewDialogProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

const UserViewDialog: React.FC<UserViewDialogProps> = ({
  open,
  onClose,
  user,
}) => {
  if (!user) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Detalles del Usuario
      </DialogTitle>
      
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3}>
          {/* Información básica */}
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Información Personal
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Nombre completo:
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {user.name}
                </Typography>
              </Box>
              
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Email:
                </Typography>
                <Typography variant="body1">
                  {user.email}
                </Typography>
              </Box>
              
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Rol:
                </Typography>
                <Chip
                  label={user.role === 'ADMIN' ? 'Administrador' : 'Editor'}
                  color={getRoleColor(user.role)}
                  size="small"
                />
              </Box>
            </Box>
          </Box>

          {/* Fechas */}
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Información de Cuenta
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Fecha de creación:
                </Typography>
                <Typography variant="body1">
                  {formatDate(user.createdAt)}
                </Typography>
              </Box>
              
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Última actualización:
                </Typography>
                <Typography variant="body1">
                  {formatDate(user.updatedAt)}
                </Typography>
              </Box>
            </Box>
          </Box>


        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserViewDialog;
