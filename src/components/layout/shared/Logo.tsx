'use client'

// React Imports
import { useEffect, useRef } from 'react'

// Third-party Imports
import Image from 'next/image'

// Component Imports

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'

const Logo = () => {
  // Refs
  const logoTextRef = useRef<HTMLSpanElement>(null)

  // Hooks
  const { isHovered, isBreakpointReached } = useVerticalNav()
  const { settings } = useSettings()

  // Vars
  const { layout } = settings

  useEffect(() => {
    if (layout !== 'collapsed') {
      return
    }

    if (logoTextRef && logoTextRef.current) {
      if (!isBreakpointReached && layout === 'collapsed' && !isHovered) {
        logoTextRef.current?.classList.add('hidden')
      } else {
        logoTextRef.current.classList.remove('hidden')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered, layout, isBreakpointReached])

  return (
    <div className='flex items-center min-bs-[24px]'>
      <Image
        src='https://res.cloudinary.com/ddqh0mkx9/image/upload/f_webp/website-v2/zyl0ca6woqgk2ehlynem'
        alt='logo'
        unoptimized
        width={300}
        height={100}
        className='w-full h-full object-contain'
      />
    </div>
  )
}

export default Logo
