// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'
import NotFound from '@views/misc/NotFound'

// Config Imports

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

const NotFoundPage = async () => {
  // Vars
  const direction = 'ltr'
  const systemMode = await getSystemMode()

  return (
    <Providers direction={direction}>
      <BlankLayout systemMode={systemMode}>
        <NotFound /> 
      </BlankLayout>
    </Providers>
  )
}

export default NotFoundPage
