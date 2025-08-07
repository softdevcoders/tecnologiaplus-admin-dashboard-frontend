import type { NextAuthOptions, Session } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import axios from 'axios'

// Extend NextAuth types
declare module 'next-auth' {
  interface User {
    role?: string
    accessToken?: string
  }
  interface Session {
    accessToken?: string
    user: {
      id?: string
      role?: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
    accessToken?: string
  }
}

// Function to decode JWT without verification (for client-side use)
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

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials')
        }

        const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL
        const loginUrl = `${apiUrl}/auth/login`

        try {
          const response = await axios.post(loginUrl, {
            email: credentials.email,
            password: credentials.password
          })

          const { access_token } = response.data

          if (access_token) {
            // Decode JWT to get user data
            const decodedToken = decodeJWT(access_token)

            if (decodedToken) {
              const user = {
                id: decodedToken.sub,
                email: decodedToken.username,
                name: decodedToken.username, // Add name property
                role: decodedToken.role,
                accessToken: access_token
              }

              return user
            }
          }

          // Si no hay access_token en la respuesta
          throw new Error('Respuesta de autenticación inválida')
        } catch (error: unknown) {
          // Manejar específicamente el error 401 de la API
          if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
              // Extraer el mensaje de error de la respuesta de la API
              const errorMessage = 'Credenciales incorrectas'

              throw new Error(errorMessage)
            } else if (error.response?.status) {
              // Otros errores HTTP
              throw new Error(`Error del servidor: ${error.response.status}`)
            } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
              // Errores de conexión
              throw new Error('No se pudo conectar con el servidor')
            }
          }

          // Error genérico para otros tipos de errores
          throw new Error('Error durante la autenticación')
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.accessToken = user.accessToken
      }

      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.id = token.sub as string
        session.user.role = token.role as string
        session.accessToken = token.accessToken as string
      }

      return session
    }
  },
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt'
  }
}
