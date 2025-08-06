import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials'
import axios from 'axios'

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
        console.log('=== AUTH ATTEMPT START ===')
        console.log('Credentials received:', {
          email: credentials?.email,
          password: credentials?.password ? '***' : 'undefined'
        })

        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials')
          throw new Error('Missing credentials')
        }

        const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL
        const loginUrl = `${apiUrl}/auth/login`

        console.log('Auth attempt with URL:', loginUrl)
        console.log('API URL being used:', apiUrl)

        try {
          console.log('Making request to backend...')

          const response = await axios.post(loginUrl, {
            email: credentials.email,
            password: credentials.password
          })

          console.log('Backend response status:', response.status)
          console.log('Backend response data:', response.data)

          const { access_token } = response.data

          if (access_token) {
            console.log('Authentication successful!')

            // Decode JWT to get user data
            const decodedToken = decodeJWT(access_token)

            console.log('Decoded token:', decodedToken)

            if (decodedToken) {
              const user = {
                id: decodedToken.sub,
                email: decodedToken.username,
                name: decodedToken.username, // Add name property
                role: decodedToken.role,
                accessToken: access_token
              }

              console.log('User data:', { id: user.id, email: user.email, role: user.role })
              
              return user
            }
          }

          console.log('No access token received')
          
          return null

        } catch (error: unknown) {
          console.log('=== AUTH ERROR ===')
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          
          console.log('Error message:', errorMessage)

          if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as {
              response?: { status?: number; statusText?: string; data?: unknown }
              config?: { url?: string }
            }

            console.log('Error status:', axiosError.response?.status)
            console.log('Error status text:', axiosError.response?.statusText)
            console.log('Error data:', axiosError.response?.data)
            console.log('Error URL:', axiosError.config?.url)
          }

          console.log('Full error:', error)
          
return null
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
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string
        session.user.role = token.role as string
        session.accessToken = token.accessToken as string
      }

      
return session
    }
  },
  pages: {
    signIn: '/auth/login'
  },
  session: {
    strategy: 'jwt'
  }
}
