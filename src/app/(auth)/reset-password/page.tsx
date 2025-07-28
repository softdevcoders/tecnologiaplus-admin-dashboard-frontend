// Component Imports
import ResetPassword from '@views/auth/ResetPassword'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

const ResetPasswordPage = async () => {
  // Vars
  const mode = await getServerMode()

  return <ResetPassword mode={mode} />
}

export default ResetPasswordPage
