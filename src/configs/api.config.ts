// Configuración de la API
export const API_CONFIG = {
  // URL base de la API
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:3001',

  // Timeout para las peticiones (en milisegundos)
  TIMEOUT: 10000,

  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json'
  },

  // Endpoints
  ENDPOINTS: {
    // Autenticación
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      PROFILE: '/auth/profile'
    },

    // Artículos
    ARTICLES: {
      LIST: '/articles',
      CREATE: '/articles',
      GET_BY_ID: (id: string) => `/articles/${id}`,
      GET_BY_SLUG: (slug: string) => `/articles/slug/${slug}`,
      UPDATE: (id: string) => `/articles/${id}`,
      DELETE: (id: string) => `/articles/${id}`,
      PUBLISH: (id: string) => `/articles/${id}/publish`,
      UNPUBLISH: (id: string) => `/articles/${id}/unpublish`,
      ARCHIVE: (id: string) => `/articles/${id}/archive`,
      FEATURED: '/articles/featured',
      BY_CATEGORY: (categoryId: string) => `/articles/category/${categoryId}`
    },

    // Categorías
    CATEGORIES: {
      LIST: '/categories',
      CREATE: '/categories',
      GET_BY_ID: (id: string) => `/categories/${id}`,
      UPDATE: (id: string) => `/categories/${id}`,
      DELETE: (id: string) => `/categories/${id}`
    },

    // Usuarios
    USERS: {
      LIST: '/users',
      CREATE: '/users',
      GET_BY_ID: (id: string) => `/users/${id}`,
      UPDATE: (id: string) => `/users/${id}`,
      DELETE: (id: string) => `/users/${id}`
    }
  },

  // Configuración de paginación por defecto
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
  },

  // Configuración de caché
  CACHE: {
    // Tiempo de caché en milisegundos (5 minutos)
    TTL: 5 * 60 * 1000,

    // Máximo número de elementos en caché
    MAX_ITEMS: 100
  }
}

// Validar configuración
export const validateApiConfig = () => {
  if (!API_CONFIG.BASE_URL) {
    console.warn('API_CONFIG.BASE_URL no está configurado. Usando valor por defecto.')
  }

  if (API_CONFIG.TIMEOUT < 1000) {
    console.warn('API_CONFIG.TIMEOUT es muy bajo. Se recomienda al menos 1000ms.')
  }
}

// Exportar configuración validada
export default API_CONFIG
