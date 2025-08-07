// Next Imports
import type { Metadata } from 'next'

// Component Imports
import ForgotPassword from '@views/auth/ForgotPassword'

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Forgotten Password to your account'
}

const ForgotPasswordPage = async () => {
  return <ForgotPassword />
}

export default ForgotPasswordPage
