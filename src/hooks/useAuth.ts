'use client'

import { useEffect, useCallback } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// Función para decodificar JWT sin verificación
function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )

    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}

// Función para verificar si un token ha expirado
function isTokenExpired(token: string): boolean {
  try {
    const decoded = decodeJWT(token)
    if (!decoded || !decoded.exp) {
      return true
    }

    // exp está en segundos, Date.now() está en milisegundos
    const currentTime = Math.floor(Date.now() / 1000)
    return decoded.exp < currentTime
  } catch (error) {
    console.error('Error checking token expiration:', error)
    return true
  }
}

// Función para obtener el tiempo restante hasta la expiración (en minutos)
function getTimeUntilExpiration(token: string): number {
  try {
    const decoded = decodeJWT(token)
    if (!decoded || !decoded.exp) {
      return 0
    }

    const currentTime = Math.floor(Date.now() / 1000)
    const timeRemaining = decoded.exp - currentTime

    // Convertir a minutos
    return Math.floor(timeRemaining / 60)
  } catch (error) {
    console.error('Error calculating time until expiration:', error)
    return 0
  }
}

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Función para cerrar sesión
  const logout = useCallback(async () => {
    try {
      await signOut({
        redirect: true,
        callbackUrl: '/auth/login'
      })
    } catch (error) {
      console.error('Error during logout:', error)
      // Fallback: redirigir manualmente
      router.push('/auth/login')
    }
  }, [router])

  // Función para verificar si la sesión ha expirado
  const checkSessionExpiration = useCallback(() => {
    if (session?.accessToken) {
      if (isTokenExpired(session.accessToken)) {
        console.warn('Session expired, logging out...')
        logout()
        return true
      }
    }
    return false
  }, [session?.accessToken, logout])

  // Función para obtener información de la sesión
  const getSessionInfo = useCallback(() => {
    if (!session?.accessToken) {
      return {
        isAuthenticated: false,
        timeUntilExpiration: 0,
        isExpired: true
      }
    }

    const isExpired = isTokenExpired(session.accessToken)
    const timeUntilExpiration = getTimeUntilExpiration(session.accessToken)

    return {
      isAuthenticated: true,
      timeUntilExpiration,
      isExpired,
      user: {
        id: session.user?.id,
        email: session.user?.email,
        name: session.user?.name,
        role: session.user?.role
      }
    }
  }, [session])

  // Verificar expiración al cargar el hook
  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      checkSessionExpiration()
    }
  }, [status, session?.accessToken, checkSessionExpiration])

  // Configurar un intervalo para verificar la expiración cada minuto
  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      const interval = setInterval(() => {
        const sessionInfo = getSessionInfo()

        if (sessionInfo.isExpired) {
          console.warn('Session expired during interval check, logging out...')
          logout()
        } else if (sessionInfo.timeUntilExpiration <= 5) {
          // Mostrar advertencia cuando quedan 5 minutos o menos
          console.warn(`Session will expire in ${sessionInfo.timeUntilExpiration} minutes`)
          // Aquí podrías mostrar una notificación al usuario
        }
      }, 60000) // Verificar cada minuto

      return () => clearInterval(interval)
    }
  }, [status, session?.accessToken, getSessionInfo, logout])

  return {
    session,
    status,
    logout,
    checkSessionExpiration,
    getSessionInfo,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading'
  }
}
