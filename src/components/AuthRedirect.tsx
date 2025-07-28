'use client'

// Next Imports
import { redirect, usePathname } from 'next/navigation'

const AuthRedirect = () => {
  const pathname = usePathname()

  const redirectUrl = `/login?redirectTo=${pathname}`
  const login = `/login`

  return redirect(pathname === login ? login : redirectUrl)
}

export default AuthRedirect
