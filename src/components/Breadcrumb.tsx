'use client'

import React from 'react'

import { useRouter } from 'next/navigation'

// MUI Imports
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  currentPage?: string
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, currentPage }) => {
  const router = useRouter()

  const handleClick = (href: string) => {
    router.push(href)
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Breadcrumbs
        separator={<Box component="i" className="ri-arrow-right-line" sx={{ fontSize: 16, color: 'primary.main' }} />}
        aria-label="breadcrumb"
        sx={{
          '& .MuiBreadcrumbs-separator': {
            color: 'primary.main'
          }
        }}
      >
        {/* Inicio siempre visible */}
        <Link
          component="button"
          variant="body2"
          onClick={() => handleClick('/dashboard')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            color: 'primary.main',
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'all 0.2s ease',
            '&:hover': {
              color: 'primary.dark',
              textDecoration: 'underline'
            }
          }}
        >
          <Box component="i" className="ri-home-line" sx={{ fontSize: 16 }} />
          Dashboard
        </Link>

        {/* Items del breadcrumb */}
        {items.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {item.icon && (
              <Box component="i" className={item.icon} sx={{ fontSize: 16, color: 'primary.main' }} />
            )}
            {item.href ? (
              <Link
                component="button"
                variant="body2"
                onClick={() => handleClick(item.href!)}
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: 'primary.dark',
                    textDecoration: 'underline'
                  }
                }}
              >
                {item.label}
              </Link>
            ) : (
              <Typography variant="body2" color="primary.main" fontWeight={500}>
                {item.label}
              </Typography>
            )}
          </Box>
        ))}

        {/* Página actual */}
        {currentPage && (
          <Typography 
            variant="body2" 
            color="primary.dark" 
            fontWeight={600}
            sx={{
              backgroundColor: 'primary.50',
              borderRadius: 1,
              px: 1.5,
              py: 0.5,
              border: '1px solid',
              borderColor: 'primary.200'
            }}
          >
            {currentPage}
          </Typography>
        )}
      </Breadcrumbs>
    </Box>
  )
}

export default Breadcrumb
