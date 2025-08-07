'use client'

import React from 'react'

import { Box, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material'

export type ViewMode = 'list' | 'grid'

interface ArticlesViewToggleProps {
  viewMode: ViewMode
  onViewModeChange: (viewMode: ViewMode) => void
}

const ArticlesViewToggle: React.FC<ArticlesViewToggleProps> = ({ viewMode, onViewModeChange }) => {
  const handleViewModeChange = (event: React.MouseEvent<HTMLElement>, newViewMode: ViewMode | null) => {
    if (newViewMode !== null) {
      onViewModeChange(newViewMode)
    }
  }

  return (
    <Box>
      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={handleViewModeChange}
        aria-label='modo de vista'
        size='small'
      >
        <ToggleButton value='list' aria-label='vista lista'>
          <Tooltip title='Vista de lista'>
            <i className='ri-list-check' />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value='grid' aria-label='vista grid'>
          <Tooltip title='Vista de tarjetas'>
            <i className='ri-grid-line' />
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  )
}

export default ArticlesViewToggle
