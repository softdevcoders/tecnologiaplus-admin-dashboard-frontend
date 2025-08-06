// Type Imports
import type { ChildrenType } from '@core/types'

// Component Imports
import GuestOnlyRoute from '@/hocs/GuestOnlyRoute'
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'

// Config Imports

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

const Layout = async (props: ChildrenType) => {
  const { children } = props

  // Vars
  const direction = 'ltr'
  const systemMode = await getSystemMode()

  return (
    <Providers direction={direction}>
      <BlankLayout systemMode={systemMode}>
        <GuestOnlyRoute>{children}</GuestOnlyRoute>
      </BlankLayout>
    </Providers>
  )
}

export default Layout
