'use client'

import React, { useState, useEffect } from 'react'

import { Alert, AlertTitle, Button, Snackbar, Box, Typography } from '@mui/material'

import { useAuth } from '@/hooks/useAuth'

interface SessionExpirationAlertProps {
  warningMinutes?: number // Minutos antes de la expiración para mostrar advertencia
}

export function SessionExpirationAlert({ warningMinutes = 5 }: SessionExpirationAlertProps) {
  const { getSessionInfo, logout } = useAuth()
  const [showWarning, setShowWarning] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)

  useEffect(() => {
    const checkSession = () => {
      const sessionInfo = getSessionInfo()

      if (sessionInfo.isAuthenticated && !sessionInfo.isExpired) {
        if (sessionInfo.timeUntilExpiration <= warningMinutes && sessionInfo.timeUntilExpiration > 0) {
          setTimeRemaining(sessionInfo.timeUntilExpiration)
          setShowWarning(true)
        } else {
          setShowWarning(false)
        }
      } else {
        setShowWarning(false)
      }
    }

    // Verificar inmediatamente
    checkSession()

    // Verificar cada 30 segundos
    const interval = setInterval(checkSession, 30000)

    return () => clearInterval(interval)
  }, [getSessionInfo, warningMinutes])

  const handleExtendSession = async () => {
    // Aquí podrías implementar la lógica para extender la sesión
    // Por ahora, simplemente ocultamos la advertencia
    setShowWarning(false)
  }

  const handleLogout = async () => {
    setShowWarning(false)
    await logout()
  }

  const formatTime = (minutes: number): string => {
    if (minutes <= 0) return '0 minutos'
    if (minutes === 1) return '1 minuto'

    return `${minutes} minutos`
  }

  return (
    <Snackbar open={showWarning} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{ zIndex: 9999 }}>
      <Alert
        severity='warning'
        sx={{
          width: '100%',
          maxWidth: 400,
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
      >
        <AlertTitle>Sesión por expirar</AlertTitle>
        <Box>
          <Typography variant='body2' sx={{ mb: 2 }}>
            Tu sesión expirará en {formatTime(timeRemaining)}.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button size='small' variant='outlined' onClick={handleLogout} color='error'>
              Cerrar sesión
            </Button>
            <Button size='small' variant='contained' onClick={handleExtendSession}>
              Extender sesión
            </Button>
          </Box>
        </Box>
      </Alert>
    </Snackbar>
  )
}
