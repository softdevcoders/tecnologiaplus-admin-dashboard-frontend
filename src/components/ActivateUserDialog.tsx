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

import type { User } from '@/services/users.service';

interface ActivateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  user: User | null;
  loading?: boolean;
}

const ActivateUserDialog: React.FC<ActivateUserDialogProps> = ({
  open,
  onClose,
  onConfirm,
  user,
  loading = false,
}) => {
  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle color="success">
        Confirmar Activación de Usuario
      </DialogTitle>
      
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography variant="body1">
            ¿Estás seguro de que quieres activar al usuario{' '}
            <strong>{user.name}</strong>?
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            Email: {user.email}
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            Rol: {user.role === 'ADMIN' ? 'Administrador' : 'Editor'}
          </Typography>

          <Alert severity="info">
            <Typography variant="body2">
              <strong>El usuario será reactivado.</strong> Una vez activado, podrá acceder nuevamente al dashboard 
              y gestionar sus artículos. Sus artículos seguirán siendo visibles públicamente.
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
          color="success"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? 'Activando...' : 'Activar Usuario'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActivateUserDialog;
