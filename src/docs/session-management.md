# Sistema de Manejo de Sesiones

## Descripción General

El sistema de manejo de sesiones implementa un control completo sobre la expiración de tokens JWT y proporciona una experiencia de usuario fluida cuando la sesión expira.

## Componentes Principales

### 1. Hook `useAuth`

**Ubicación**: `src/hooks/useAuth.ts`

**Funcionalidades**:
- Verificación automática de expiración de tokens
- Monitoreo continuo de la sesión
- Funciones para cerrar sesión
- Información detallada de la sesión

**Uso**:
```typescript
import { useAuth } from '@/hooks/useAuth'

function MyComponent() {
  const { 
    session, 
    status, 
    logout, 
    checkSessionExpiration, 
    getSessionInfo,
    isAuthenticated,
    isLoading 
  } = useAuth()

  const sessionInfo = getSessionInfo()
  
  return (
    <div>
      {sessionInfo.isAuthenticated && (
        <p>Sesión activa - Expira en {sessionInfo.timeUntilExpiration} minutos</p>
      )}
    </div>
  )
}
```

### 2. Cliente HTTP Mejorado

**Ubicación**: `src/libs/http.ts`

**Funcionalidades**:
- Verificación de expiración antes de cada petición
- Logout automático en errores 401
- Manejo centralizado de errores de autenticación

**Características**:
- Interceptores de solicitud y respuesta
- Verificación automática de tokens expirados
- Redirección automática al login

### 3. Componente de Alerta de Expiración

**Ubicación**: `src/components/SessionExpirationAlert.tsx`

**Funcionalidades**:
- Alerta visual cuando la sesión está por expirar
- Opciones para extender sesión o cerrar sesión
- Configuración de tiempo de advertencia

**Uso**:
```typescript
import { SessionExpirationAlert } from '@/components/SessionExpirationAlert'

// En el layout principal
<SessionExpirationAlert warningMinutes={5} />
```

### 4. Componente de Información de Sesión

**Ubicación**: `src/components/SessionInfo.tsx`

**Funcionalidades**:
- Mostrar información del usuario actual
- Tiempo restante de sesión
- Opción de cerrar sesión
- Variantes compacta y detallada

**Uso**:
```typescript
import { SessionInfo } from '@/components/SessionInfo'

// Variante compacta (menú desplegable)
<SessionInfo variant="compact" />

// Variante detallada (información completa visible)
<SessionInfo variant="detailed" />
```

## Flujo de Funcionamiento

### 1. Verificación Inicial
- Al cargar la aplicación, se verifica si el token actual ha expirado
- Si ha expirado, se redirige automáticamente al login

### 2. Monitoreo Continuo
- Cada minuto se verifica el estado de la sesión
- Se muestra advertencia cuando quedan 5 minutos o menos
- Se ejecuta logout automático cuando expira

### 3. Verificación en Peticiones
- Antes de cada petición HTTP se verifica la validez del token
- Si el token ha expirado, se cancela la petición y se hace logout
- Se manejan errores 401 del servidor con logout automático

### 4. Experiencia de Usuario
- Alertas visuales antes de la expiración
- Información clara sobre el tiempo restante
- Opciones para extender o cerrar sesión
- Redirección automática al login

## Configuración

### Variables de Entorno
```env
# Tiempo de advertencia (en minutos)
NEXT_PUBLIC_SESSION_WARNING_MINUTES=5

# Intervalo de verificación (en milisegundos)
NEXT_PUBLIC_SESSION_CHECK_INTERVAL=60000
```

### Personalización
```typescript
// En el layout principal
<SessionExpirationAlert warningMinutes={10} />

// En componentes específicos
const { getSessionInfo } = useAuth()
const sessionInfo = getSessionInfo()

if (sessionInfo.timeUntilExpiration <= 2) {
  // Lógica personalizada para sesión por expirar
}
```

## Funciones de Utilidad

### Verificación de Token
```typescript
import { isTokenExpired, getTimeUntilExpiration } from '@/hooks/useAuth'

const token = 'your-jwt-token'
const isExpired = isTokenExpired(token)
const timeRemaining = getTimeUntilExpiration(token) // en minutos
```

### Decodificación de JWT
```typescript
import { decodeJWT } from '@/hooks/useAuth'

const decoded = decodeJWT(token)
console.log(decoded.exp) // Timestamp de expiración
console.log(decoded.sub) // ID del usuario
```

## Manejo de Errores

### Errores Comunes
1. **Token expirado**: Logout automático y redirección
2. **Error 401 del servidor**: Logout automático
3. **Error de conexión**: Mensaje informativo
4. **Token inválido**: Logout automático

### Logs y Debugging
```typescript
// Los logs se muestran en la consola del navegador
console.warn('Session expired, logging out...')
console.warn('Session will expire in X minutes')
console.error('Error during automatic logout:', error)
```

## Seguridad

### Medidas Implementadas
- Verificación de expiración en cada petición
- Logout automático en tokens expirados
- No almacenamiento de tokens en localStorage
- Uso de cookies seguras de NextAuth
- Verificación del lado del cliente y servidor

### Buenas Prácticas
- Nunca almacenar tokens en localStorage
- Usar HTTPS en producción
- Implementar refresh tokens si es necesario
- Validar tokens en el servidor
- Logout automático en errores de autenticación

## Extensibilidad

### Agregar Refresh Tokens
```typescript
// En useAuth.ts
const refreshToken = async () => {
  try {
    const response = await httpClient.post('/auth/refresh', {
      refresh_token: session.refreshToken
    })
    // Actualizar sesión con nuevo token
  } catch (error) {
    // Si falla el refresh, hacer logout
    await logout()
  }
}
```

### Agregar Notificaciones Personalizadas
```typescript
// En SessionExpirationAlert.tsx
const showCustomNotification = (message: string) => {
  // Implementar notificación personalizada
  toast.info(message)
}
```

## Troubleshooting

### Problemas Comunes

1. **Sesión no se cierra automáticamente**
   - Verificar que el hook useAuth esté importado
   - Revisar logs de consola para errores
   - Verificar configuración de NextAuth

2. **Alertas no aparecen**
   - Verificar que SessionExpirationAlert esté en el layout
   - Revisar configuración de warningMinutes
   - Verificar que el token tenga campo 'exp'

3. **Errores de redirección**
   - Verificar configuración de callbackUrl
   - Revisar rutas de autenticación
   - Verificar configuración de NextAuth

### Debugging
```typescript
// Agregar logs para debugging
const sessionInfo = getSessionInfo()
console.log('Session info:', sessionInfo)
console.log('Token expiration:', new Date(sessionInfo.exp * 1000))
``` 