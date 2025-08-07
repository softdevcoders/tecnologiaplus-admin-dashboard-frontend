'use client'

import React, { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

import { Snackbar, Alert } from '@mui/material'
import type { AlertColor } from '@mui/material'

interface NotificationContextType {
  showNotification: (message: string, severity?: AlertColor) => void
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showWarning: (message: string) => void
  showInfo: (message: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

interface NotificationProviderProps {
  children: ReactNode
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState<AlertColor>('info')

  const showNotification = (message: string, severity: AlertColor = 'info') => {
    setMessage(message)
    setSeverity(severity)
    setOpen(true)
  }

  const showSuccess = (message: string) => {
    return showNotification(message, 'success')
  }

  const showError = (message: string) => {
    return showNotification(message, 'error')
  }

  const showWarning = (message: string) => {
    return showNotification(message, 'warning')
  }

  const showInfo = (message: string) => {
    return showNotification(message, 'info')
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo
      }}
    >
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)

  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }

  return context
} 