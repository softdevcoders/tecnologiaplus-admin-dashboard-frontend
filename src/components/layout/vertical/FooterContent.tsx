// Next Imports
import Link from 'next/link'

// Third-party Imports
import classnames from 'classnames'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

const FooterContent = () => {
  return (
    <div
      className={classnames(verticalLayoutClasses.footerContent, 'flex items-center justify-between flex-wrap gap-4')}
    >
      <p>
        <span>{`© ${new Date().getFullYear()} - `}</span>
        <Link href='https://tecnologiaplus.com' target='_blank' className='text-primary'>
          Tecnologiaplus
        </Link>
      </p>
    </div>
  )
}

export default FooterContent
