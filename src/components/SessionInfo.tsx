'use client'

import React from 'react'
import { 
  Box, 
  Typography, 
  Chip, 
  IconButton, 
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material'
import { useAuth } from '@/hooks/useAuth'

interface SessionInfoProps {
  variant?: 'compact' | 'detailed'
}

export function SessionInfo({ variant = 'compact' }: SessionInfoProps) {
  const { getSessionInfo, logout } = useAuth()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  
  const sessionInfo = getSessionInfo()
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    handleClose()
    await logout()
  }

  const formatTime = (minutes: number): string => {
    if (minutes <= 0) return 'Expirada'
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  const getStatusColor = (minutes: number): 'default' | 'warning' | 'error' => {
    if (minutes <= 0) return 'error'
    if (minutes <= 5) return 'warning'
    return 'default'
  }

  if (!sessionInfo.isAuthenticated) {
    return null
  }

  if (variant === 'compact') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title="Información de sesión">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ 
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' }
            }}
          >
            <i className="ri-user-line" />
          </IconButton>
        </Tooltip>
        
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem disabled>
            <ListItemIcon>
              <i className="ri-user-line" />
            </ListItemIcon>
            <ListItemText 
              primary={sessionInfo.user?.name || sessionInfo.user?.email}
              secondary={sessionInfo.user?.role}
            />
          </MenuItem>
          
          <Divider />
          
          <MenuItem disabled>
            <ListItemIcon>
              <i className="ri-time-line" />
            </ListItemIcon>
            <ListItemText 
              primary="Sesión activa"
              secondary={`Expira en ${formatTime(sessionInfo.timeUntilExpiration)}`}
            />
          </MenuItem>
          
          <Divider />
          
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <i className="ri-logout-box-r-line" />
            </ListItemIcon>
            <ListItemText primary="Cerrar sesión" />
          </MenuItem>
        </Menu>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="body2" color="text.secondary">
          {sessionInfo.user?.name || sessionInfo.user?.email}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {sessionInfo.user?.role}
        </Typography>
      </Box>
      
      <Chip
        label={`Sesión: ${formatTime(sessionInfo.timeUntilExpiration)}`}
        color={getStatusColor(sessionInfo.timeUntilExpiration)}
        size="small"
        variant="outlined"
      />
      
      <Tooltip title="Cerrar sesión">
        <IconButton
          onClick={handleLogout}
          size="small"
          color="error"
        >
          <i className="ri-logout-box-r-line" />
        </IconButton>
      </Tooltip>
    </Box>
  )
} 