import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { getSession, signOut } from 'next-auth/react'
import API_CONFIG from '@/configs/api.config'

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

    const currentTime = Math.floor(Date.now() / 1000)
    return decoded.exp < currentTime
  } catch (error) {
    console.error('Error checking token expiration:', error)
    return true
  }
}

// Tipos para la respuesta de la API
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  message: string
  status: number
  code?: string
}

// Configuración por defecto
const DEFAULT_CONFIG: AxiosRequestConfig = {
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS
}

class HttpClient {
  private instance: AxiosInstance

  constructor(config: AxiosRequestConfig = {}) {
    this.instance = axios.create({
      ...DEFAULT_CONFIG,
      ...config
    })

    // Interceptor para agregar el token de autenticación
    this.instance.interceptors.request.use(
      async config => {
        // Solo agregar token si no es una petición de autenticación
        if (!config.url?.includes('/auth/')) {
          try {
            const session = await getSession()
            if (session?.accessToken) {
              // Verificar si el token ha expirado antes de usarlo
              if (isTokenExpired(session.accessToken)) {
                console.warn('Token expired, logging out...')
                await signOut({
                  redirect: true,
                  callbackUrl: '/auth/login'
                })
                throw new Error('Token expired')
              }

              config.headers.Authorization = `Bearer ${session.accessToken}`
            }
          } catch (error) {
            console.warn('Error getting session or token expired:', error)
            // Si hay un error con la sesión, redirigir al login
            if (error instanceof Error && error.message === 'Token expired') {
              throw error
            }
          }
        }
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )

    // Interceptor para manejar respuestas y errores
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response
      },
      async error => {
        return this.handleError(error)
      }
    )
  }

  private async handleError(error: any): Promise<never> {
    if (axios.isAxiosError(error)) {
      const apiError: ApiError = {
        message: error.response?.data?.message || error.message || 'Error de conexión',
        status: error.response?.status || 500,
        code: error.code
      }

      // Manejar errores específicos
      if (error.response?.status === 401) {
        // Token expirado o inválido
        apiError.message = 'Sesión expirada. Por favor, inicia sesión nuevamente.'

        // Cerrar sesión automáticamente
        try {
          await signOut({
            redirect: true,
            callbackUrl: '/auth/login'
          })
        } catch (signOutError) {
          console.error('Error during automatic logout:', signOutError)
        }
      } else if (error.response?.status === 403) {
        apiError.message = 'No tienes permisos para realizar esta acción.'
      } else if (error.response?.status === 404) {
        apiError.message = 'Recurso no encontrado.'
      } else if (error.response?.status >= 500) {
        apiError.message = 'Error del servidor. Inténtalo más tarde.'
      }

      throw apiError
    }

    // Error no relacionado con axios
    throw {
      message: error.message || 'Error desconocido',
      status: 500
    }
  }

  // Métodos HTTP
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.get(url, config)
    // Si la respuesta no tiene la estructura ApiResponse, la envuelve
    if (response.data && typeof response.data === 'object' && !('success' in response.data)) {
      return {
        data: response.data,
        success: true,
        message: 'Operación exitosa'
      }
    }
    return response.data
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.post(url, data, config)
    // Si la respuesta no tiene la estructura ApiResponse, la envuelve
    if (response.data && typeof response.data === 'object' && !('success' in response.data)) {
      return {
        data: response.data,
        success: true,
        message: 'Operación exitosa'
      }
    }
    return response.data
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.put(url, data, config)
    // Si la respuesta no tiene la estructura ApiResponse, la envuelve
    if (response.data && typeof response.data === 'object' && !('success' in response.data)) {
      return {
        data: response.data,
        success: true,
        message: 'Operación exitosa'
      }
    }
    return response.data
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.patch(url, data, config)
    // Si la respuesta no tiene la estructura ApiResponse, la envuelve
    if (response.data && typeof response.data === 'object' && !('success' in response.data)) {
      return {
        data: response.data,
        success: true,
        message: 'Operación exitosa'
      }
    }
    return response.data
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.delete(url, config)
    // Si la respuesta no tiene la estructura ApiResponse, la envuelve
    if (response.data && typeof response.data === 'object' && !('success' in response.data)) {
      return {
        data: response.data,
        success: true,
        message: 'Operación exitosa'
      }
    }
    return response.data
  }

  // Método para obtener la instancia de axios si necesitas configuración específica
  getInstance(): AxiosInstance {
    return this.instance
  }
}

// Instancia singleton
const httpClient = new HttpClient()

export default httpClient
export { HttpClient }
