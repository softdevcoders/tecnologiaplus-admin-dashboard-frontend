// Next Imports
import type { Metadata } from 'next'

// Component Imports
import Login from '@/views/auth/Login'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false
    }
  }
}

const LoginPage = async () => {
  return <Login />
}

export default LoginPage
