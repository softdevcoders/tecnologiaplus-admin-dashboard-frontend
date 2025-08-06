'use client'

// Next Imports
import Link from 'next/link'
import Image from 'next/image'

// MUI Imports
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

const ForgotPassword = () => {
  // Vars
  // Hooks
  const { settings } = useSettings()

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <div className='plb-12 pis-12'>
          <Image
            src='https://res.cloudinary.com/ddqh0mkx9/image/upload/f_webp/website-v2/zyl0ca6woqgk2ehlynem'
            alt='character-illustration'
            width={700}
            height={700}
            className='max-bs-[700px] max-is-full bs-auto object-contain'
          />
        </div>
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <div className='flex flex-col gap-5 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset]'>
          <div>
            <Typography variant='h4'>Olvidé mi contraseña</Typography>
            <Typography className='mbs-1'>
              Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña
            </Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()} className='flex flex-col gap-5'>
            <TextField autoFocus fullWidth label='Correo electrónico' />
            <Button fullWidth variant='contained' type='submit'>
              Enviar enlace de recuperación
            </Button>
            <Typography className='flex justify-center items-center' color='primary.main'>
              <Link href='/login' className='flex items-center'>
                <i className='ri-arrow-left-s-line' />
                <span>Volver a Iniciar sesión</span>
              </Link>
            </Typography>
          </form>
        </div>
      </div>
    </div>
  )
}

  export default ForgotPassword
