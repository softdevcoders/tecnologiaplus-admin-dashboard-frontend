// Next Imports
import type { Metadata } from 'next'

// Component Imports
import Login from '@views/auth/Login'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

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
  // Vars
  const mode = await getServerMode()

  return <Login mode={mode} />
}

export default LoginPage
