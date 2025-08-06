'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Image from 'next/image'

import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import DirectionalIcon from '@components/DirectionalIcon'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Util Imports

const ResetPassword = () => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)

  // Vars

  // Hooks
  const { settings } = useSettings()

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleClickShowConfirmPassword = () => setIsConfirmPasswordShown(show => !show)

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
            <Typography variant='h4'>Restablecer contraseña</Typography>
            <Typography className='mbs-1'>
              Por favor, ingresa tu nueva contraseña y confírmala para restablecerla.
            </Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()} className='flex flex-col gap-5'>
            <TextField
              autoFocus
              fullWidth
              label='Contraseña'
              type={isPasswordShown ? 'text' : 'password'}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        size='small'
                        edge='end'
                        onClick={handleClickShowPassword}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />
            <TextField
              fullWidth
              label='Confirmar contraseña'
              type={isConfirmPasswordShown ? 'text' : 'password'}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        size='small'
                        edge='end'
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <i className={isConfirmPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />
            <Button fullWidth variant='contained' type='submit'>
              Establecer nueva contraseña
            </Button>
            <Typography className='flex justify-center items-center' color='primary.main'>
              <Link href={'/login'} className='flex items-center gap-1.5'>
                <DirectionalIcon
                  ltrIconClass='ri-arrow-left-s-line'
                  rtlIconClass='ri-arrow-right-s-line'
                  className='text-xl'
                />
                <span>Volver a Iniciar sesión</span>
              </Link>
            </Typography>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
