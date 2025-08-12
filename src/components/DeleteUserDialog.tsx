import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { User } from '@/services/users.service';

interface DeleteUserDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  user: User | null;
  loading?: boolean;
}

const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  open,
  onClose,
  onConfirm,
  user,
  loading = false,
}) => {
  if (!user) return null;

  const hasArticles = user.articles && user.articles.length > 0;
  const isDeactivation = hasArticles;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle color={isDeactivation ? "warning" : "error"}>
        {isDeactivation ? "Confirmar Desactivación de Usuario" : "Confirmar Eliminación de Usuario"}
      </DialogTitle>
      
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography variant="body1">
            {isDeactivation 
              ? `¿Estás seguro de que quieres desactivar al usuario `
              : `¿Estás seguro de que quieres eliminar al usuario `
            }
            <strong>{user.name}</strong>?
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            Email: {user.email}
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            Rol: {user.role === 'ADMIN' ? 'Administrador' : 'Editor'}
          </Typography>

          {hasArticles && (
            <Alert severity="warning">
              <Typography variant="body2">
                <strong>¡Atención!</strong> Este usuario tiene {user.articles.length} artículo(s) publicado(s). 
                Al desactivar el usuario, sus artículos se mantendrán pero no podrá iniciar sesión.
              </Typography>
            </Alert>
          )}

          <Alert severity={isDeactivation ? "warning" : "error"}>
            <Typography variant="body2">
              {isDeactivation ? (
                <>
                  <strong>El usuario será desactivado.</strong> Sus artículos se mantendrán 
                  y podrá ser reactivado posteriormente si es necesario.
                </>
              ) : (
                <>
                  <strong>Esta acción no se puede deshacer.</strong> Una vez eliminado, 
                  el usuario y todos sus datos asociados se perderán permanentemente.
                </>
              )}
            </Typography>
          </Alert>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          color={isDeactivation ? "warning" : "error"}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading 
            ? (isDeactivation ? 'Desactivando...' : 'Eliminando...') 
            : (isDeactivation ? 'Desactivar Usuario' : 'Eliminar Usuario')
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUserDialog;
