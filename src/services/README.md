# Arquitectura de Servicios HTTP

Esta documentación describe la arquitectura limpia y escalable implementada para las peticiones HTTP en el proyecto.

## Estructura

```
src/
├── libs/
│   └── http.ts              # Librería HTTP reutilizable con axios
├── services/
│   ├── articles.service.ts  # Servicio específico para artículos
│   └── README.md           # Esta documentación
├── hooks/
│   └── useArticles.ts      # Hook personalizado para artículos
└── configs/
    └── api.config.ts       # Configuración centralizada de la API
```

## Componentes

### 1. Librería HTTP (`libs/http.ts`)

Clase `HttpClient` que proporciona una interfaz limpia para realizar peticiones HTTP con las siguientes características:

- **Interceptores automáticos**: Agrega automáticamente el token de autenticación desde NextAuth
- **Manejo de errores centralizado**: Convierte errores de axios en errores tipados
- **Configuración centralizada**: Usa la configuración desde `api.config.ts`
- **Métodos HTTP**: GET, POST, PUT, PATCH, DELETE

```typescript
import httpClient from '@/libs/http'

// Ejemplo de uso
const response = await httpClient.get<Article[]>('/articles')
```

### 2. Servicios Específicos (`services/`)

Cada servicio maneja un recurso específico de la API:

- **Tipos TypeScript**: Interfaces para requests y responses
- **Métodos CRUD**: Operaciones básicas y específicas del dominio
- **Filtros y paginación**: Manejo de parámetros de consulta
- **Operaciones específicas**: Métodos como publish, archive, etc.

```typescript
import articlesService from '@/services/articles.service'

// Ejemplo de uso
const articles = await articlesService.getArticles({ 
  page: 1, 
  limit: 10, 
  status: 'published' 
})
```

### 3. Hooks Personalizados (`hooks/`)

Hooks de React que encapsulan la lógica de estado y las operaciones:

- **Estado local**: Loading, error, data
- **Operaciones CRUD**: Métodos para crear, actualizar, eliminar
- **Integración con NextAuth**: Verificación de autenticación
- **Optimistic updates**: Actualización inmediata del UI

```typescript
import { useArticles } from '@/hooks/useArticles'

// Ejemplo de uso
const { articles, loading, error, createArticle } = useArticles()
```

### 4. Configuración (`configs/api.config.ts`)

Configuración centralizada para toda la aplicación:

- **URLs de la API**: Endpoints organizados por recurso
- **Configuración por defecto**: Timeouts, headers, paginación
- **Validación**: Verificación de configuración al inicio

## Características Principales

### Autenticación Automática

El token de acceso se obtiene automáticamente de la sesión de NextAuth y se incluye en todas las peticiones:

```typescript
// Se agrega automáticamente en el interceptor
config.headers.Authorization = `Bearer ${session.accessToken}`
```

### Manejo de Errores

Errores tipados y mensajes localizados:

```typescript
export interface ApiError {
  message: string
  status: number
  code?: string
}
```

### Tipado Fuerte

TypeScript en toda la cadena:

```typescript
// Request tipado
interface CreateArticleRequest {
  title: string
  content: string
  status?: 'draft' | 'published' | 'archived'
}

// Response tipado
interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}
```

### Paginación y Filtros

Soporte completo para paginación y filtros:

```typescript
interface ArticlesFilters {
  page?: number
  limit?: number
  status?: 'draft' | 'published' | 'archived'
  search?: string
  sort_by?: 'created_at' | 'updated_at' | 'title'
  sort_order?: 'asc' | 'desc'
}
```

## Uso en Componentes

### Página de Artículos

```typescript
const ArticulosPage = () => {
  const {
    articles,
    loading,
    error,
    fetchArticles,
    createArticle,
    deleteArticle,
    publishArticle
  } = useArticles()

  // El hook maneja automáticamente:
  // - Carga inicial de datos
  // - Estado de loading
  // - Manejo de errores
  // - Actualización del estado
}
```

## Extensibilidad

### Agregar un Nuevo Servicio

1. **Crear el servicio**:
```typescript
// services/users.service.ts
import httpClient from '@/libs/http'

class UsersService {
  private baseUrl = '/users'
  
  async getUsers() {
    return httpClient.get<User[]>(this.baseUrl)
  }
}

export default new UsersService()
```

2. **Crear el hook**:
```typescript
// hooks/useUsers.ts
import { useState, useEffect } from 'react'
import usersService from '@/services/users.service'

export const useUsers = () => {
  // Implementar lógica similar a useArticles
}
```

3. **Usar en componentes**:
```typescript
const UsersPage = () => {
  const { users, loading, error } = useUsers()
  // ...
}
```

## Variables de Entorno

Configurar en `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
# o
API_URL=http://localhost:3001
```

## Mejores Prácticas

1. **Siempre usar tipos**: Definir interfaces para requests y responses
2. **Manejar errores**: Usar try-catch y mostrar mensajes apropiados
3. **Optimistic updates**: Actualizar UI inmediatamente cuando sea posible
4. **Loading states**: Mostrar indicadores de carga apropiados
5. **Validación**: Validar datos antes de enviar a la API
6. **Caché**: Considerar implementar caché para datos que no cambian frecuentemente

## Troubleshooting

### Error 401 (Unauthorized)
- Verificar que el usuario esté autenticado
- Verificar que el token no haya expirado
- Revisar la configuración de NextAuth

### Error de CORS
- Verificar que la URL de la API esté configurada correctamente
- Verificar que el backend permita peticiones desde el frontend

### Timeout
- Aumentar el timeout en `api.config.ts`
- Verificar la conectividad de red
- Verificar que el backend esté respondiendo 