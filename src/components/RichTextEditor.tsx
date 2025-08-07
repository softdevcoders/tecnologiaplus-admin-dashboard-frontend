'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Box, Typography } from '@mui/material'

// Importar React Quill dinámicamente para evitar problemas de SSR
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => (
    <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando editor...</Box>
  )
})

// Importar estilos de Quill
import 'react-quill/dist/quill.snow.css'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  error?: boolean
  helperText?: string
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Escribe el contenido del artículo...',
  label,
  error = false,
  helperText
}) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Configuración simplificada del editor Quill
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean']
    ]
  }

  const formats = ['header', 'bold', 'italic', 'underline', 'list', 'bullet', 'link']

  if (!mounted) {
    return (
      <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Cargando editor...
      </Box>
    )
  }

  return (
    <Box>
      {label && (
        <Typography variant='subtitle2' sx={{ mb: 1, color: error ? 'error.main' : 'text.primary' }}>
          {label}
        </Typography>
      )}

      <Box
        sx={{
          '& .ql-container': {
            minHeight: 300,
            fontSize: '14px',
            fontFamily: 'inherit'
          },
          '& .ql-editor': {
            minHeight: 300,
            padding: '12px 15px'
          },
          '& .ql-toolbar': {
            borderTop: '1px solid #ccc',
            borderLeft: '1px solid #ccc',
            borderRight: '1px solid #ccc',
            borderBottom: 'none',
            borderRadius: '4px 4px 0 0'
          },
          '& .ql-container': {
            borderBottom: '1px solid #ccc',
            borderLeft: '1px solid #ccc',
            borderRight: '1px solid #ccc',
            borderTop: 'none',
            borderRadius: '0 0 4px 4px'
          },
          '& .ql-editor.ql-blank::before': {
            color: '#999',
            fontStyle: 'italic'
          },
          ...(error && {
            '& .ql-toolbar, & .ql-container': {
              borderColor: 'error.main'
            }
          })
        }}
      >
        <ReactQuill
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          theme='snow'
          preserveWhitespace
        />
      </Box>

      {helperText && (
        <Typography
          variant='caption'
          color={error ? 'error.main' : 'text.secondary'}
          sx={{ mt: 0.5, display: 'block' }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  )
}

export default RichTextEditor
