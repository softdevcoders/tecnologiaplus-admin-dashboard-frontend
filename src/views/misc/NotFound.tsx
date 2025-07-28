'use client'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import Illustrations from '@components/Illustrations'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import Image from 'next/image'

const NotFound = ({ mode }: { mode: Mode }) => {
  // Vars
  const darkImg = '/images/pages/misc-mask-dark.png'
  const lightImg = '/images/pages/misc-mask-light.png'

  // Hooks
  const miscBackground = useImageVariant(mode, lightImg, darkImg)

  return (
    <div className='flex items-center justify-center min-bs-[100dvh] relative p-6 overflow-x-hidden'>
      <div className='flex items-center flex-col text-center gap-10'>

        <Image
          alt='error-illustration'
          src='https://res.cloudinary.com/ddqh0mkx9/image/upload/f_webp/website-v2/zyl0ca6woqgk2ehlynem'
          className='object-contain w-full h-full'
          width={500}
          height={500}
        />
        <div className='flex flex-col gap-2 is-[90vw] sm:is-[unset]'>
          <Typography className='font-medium text-8xl' color='text.primary'>
            404
          </Typography>
          <Typography variant='h4'>Página no encontrada ⚠️</Typography>
          <Typography>No pudimos encontrar la página que estás buscando.</Typography>
        </div>
        <Button href={'/'} component={Link} variant='contained'>
          Volver a Inicio
        </Button>
      </div>
    </div>
  )
}

export default NotFound
