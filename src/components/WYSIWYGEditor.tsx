'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material'

interface WYSIWYGEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  error?: boolean
  helperText?: string
}

const WYSIWYGEditor: React.FC<WYSIWYGEditorProps> = ({
  value,
  onChange,
  placeholder = 'Escribe el contenido del artículo...',
  label,
  error = false,
  helperText,
}) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    updateContent()
  }

  const updateContent = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handleFormat = (format: string) => {
    switch (format) {
      case 'bold':
        execCommand('bold')
        break
      case 'italic':
        execCommand('italic')
        break
      case 'underline':
        execCommand('underline')
        break
      case 'h1':
        execCommand('formatBlock', '<h1>')
        break
      case 'h2':
        execCommand('formatBlock', '<h2>')
        break
      case 'h3':
        execCommand('formatBlock', '<h3>')
        break
      case 'p':
        execCommand('formatBlock', '<p>')
        break
      case 'ul':
        execCommand('insertUnorderedList')
        break
      case 'ol':
        execCommand('insertOrderedList')
        break
      case 'link':
        const selection = window.getSelection()
        if (selection && selection.toString()) {
          setLinkText(selection.toString())
          setLinkDialogOpen(true)
        }
        break
      case 'image':
        const imageUrl = prompt('Ingresa la URL de la imagen:')
        if (imageUrl) {
          execCommand('insertImage', imageUrl)
        }
        break
      case 'alignLeft':
        execCommand('justifyLeft')
        break
      case 'alignCenter':
        execCommand('justifyCenter')
        break
      case 'alignRight':
        execCommand('justifyRight')
        break
      case 'alignJustify':
        execCommand('justifyFull')
        break
    }
  }

  const handleLinkSubmit = () => {
    if (linkUrl && linkText) {
      const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`
      execCommand('insertHTML', linkHtml)
      setLinkDialogOpen(false)
      setLinkUrl('')
      setLinkText('')
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
    updateContent()
  }

  const isFormatActive = (format: string) => {
    return document.queryCommandState(format)
  }

  return (
    <Box>
      {label && (
        <Typography variant="subtitle2" sx={{ mb: 1, color: error ? 'error.main' : 'text.primary' }}>
          {label}
        </Typography>
      )}
      
      <Paper 
        variant="outlined" 
        sx={{ 
          borderColor: error ? 'error.main' : undefined,
          overflow: 'hidden'
        }}
      >
        {/* Toolbar */}
        <Box sx={{ 
          p: 1, 
          borderBottom: 1, 
          borderColor: 'divider',
          backgroundColor: 'grey.50'
        }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
            {/* Text Format */}
            <ToggleButtonGroup size="small" sx={{ mr: 1 }}>
              <Tooltip title="Negrita">
                <ToggleButton 
                  value="bold" 
                  onClick={() => handleFormat('bold')}
                  selected={isFormatActive('bold')}
                >
                  <strong>B</strong>
                </ToggleButton>
              </Tooltip>
              <Tooltip title="Cursiva">
                <ToggleButton 
                  value="italic" 
                  onClick={() => handleFormat('italic')}
                  selected={isFormatActive('italic')}
                >
                  <em>I</em>
                </ToggleButton>
              </Tooltip>
              <Tooltip title="Subrayado">
                <ToggleButton 
                  value="underline" 
                  onClick={() => handleFormat('underline')}
                  selected={isFormatActive('underline')}
                >
                  <u>U</u>
                </ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>

            <Divider orientation="vertical" flexItem />

            {/* Headers */}
            <ToggleButtonGroup size="small" sx={{ mr: 1 }}>
              <Tooltip title="Título 1">
                <ToggleButton value="h1" onClick={() => handleFormat('h1')}>
                  H1
                </ToggleButton>
              </Tooltip>
              <Tooltip title="Título 2">
                <ToggleButton value="h2" onClick={() => handleFormat('h2')}>
                  H2
                </ToggleButton>
              </Tooltip>
              <Tooltip title="Título 3">
                <ToggleButton value="h3" onClick={() => handleFormat('h3')}>
                  H3
                </ToggleButton>
              </Tooltip>
              <Tooltip title="Párrafo">
                <ToggleButton value="p" onClick={() => handleFormat('p')}>
                  P
                </ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>

            <Divider orientation="vertical" flexItem />

            {/* Lists */}
            <ToggleButtonGroup size="small" sx={{ mr: 1 }}>
              <Tooltip title="Lista con viñetas">
                <ToggleButton value="ul" onClick={() => handleFormat('ul')}>
                  •
                </ToggleButton>
              </Tooltip>
              <Tooltip title="Lista numerada">
                <ToggleButton value="ol" onClick={() => handleFormat('ol')}>
                  1.
                </ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>

            <Divider orientation="vertical" flexItem />

            {/* Alignment */}
            <ToggleButtonGroup size="small" sx={{ mr: 1 }}>
              <Tooltip title="Alinear izquierda">
                <ToggleButton value="alignLeft" onClick={() => handleFormat('alignLeft')}>
                  <i className="ri-align-left" />
                </ToggleButton>
              </Tooltip>
              <Tooltip title="Centrar">
                <ToggleButton value="alignCenter" onClick={() => handleFormat('alignCenter')}>
                  <i className="ri-align-center" />
                </ToggleButton>
              </Tooltip>
              <Tooltip title="Alinear derecha">
                <ToggleButton value="alignRight" onClick={() => handleFormat('alignRight')}>
                  <i className="ri-align-right" />
                </ToggleButton>
              </Tooltip>
              <Tooltip title="Justificar">
                <ToggleButton value="alignJustify" onClick={() => handleFormat('alignJustify')}>
                  <i className="ri-align-justify" />
                </ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>

            <Divider orientation="vertical" flexItem />

            {/* Links and Images */}
            <ToggleButtonGroup size="small">
              <Tooltip title="Insertar enlace">
                <ToggleButton value="link" onClick={() => handleFormat('link')}>
                  <i className="ri-link" />
                </ToggleButton>
              </Tooltip>
              <Tooltip title="Insertar imagen">
                <ToggleButton value="image" onClick={() => handleFormat('image')}>
                  <i className="ri-image-line" />
                </ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {/* Editor Area */}
        <Box
          ref={editorRef}
          contentEditable
          onInput={updateContent}
          onPaste={handlePaste}
          onBlur={updateContent}
          sx={{
            minHeight: 400,
            padding: 3,
            outline: 'none',
            fontSize: '16px',
            lineHeight: 1.6,
            fontFamily: 'inherit',
            '&:empty:before': {
              content: `"${placeholder}"`,
              color: '#999',
              fontStyle: 'italic',
            },
            '& h1': {
              fontSize: '2em',
              fontWeight: 'bold',
              margin: '0.67em 0',
            },
            '& h2': {
              fontSize: '1.5em',
              fontWeight: 'bold',
              margin: '0.83em 0',
            },
            '& h3': {
              fontSize: '1.17em',
              fontWeight: 'bold',
              margin: '1em 0',
            },
            '& p': {
              margin: '1em 0',
            },
            '& ul, & ol': {
              margin: '1em 0',
              paddingLeft: '2em',
            },
            '& li': {
              margin: '0.5em 0',
            },
            '& a': {
              color: 'primary.main',
              textDecoration: 'underline',
            },
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              margin: '1em 0',
            },
          }}
        />
      </Paper>
      
      {helperText && (
        <Typography 
          variant="caption" 
          color={error ? 'error.main' : 'text.secondary'}
          sx={{ mt: 0.5, display: 'block' }}
        >
          {helperText}
        </Typography>
      )}

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onClose={() => setLinkDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Insertar Enlace</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Texto del enlace"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="URL del enlace"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://ejemplo.com"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLinkDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleLinkSubmit} variant="contained">Insertar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default WYSIWYGEditor 