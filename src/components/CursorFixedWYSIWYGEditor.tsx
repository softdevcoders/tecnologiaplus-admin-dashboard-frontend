'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  Box,
  Typography,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Divider,
  Tabs,
  Tab,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress
} from '@mui/material'
import { useImages } from '@/hooks/useImages'

interface CursorFixedWYSIWYGEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  error?: boolean
  helperText?: string
}

const CursorFixedWYSIWYGEditor: React.FC<CursorFixedWYSIWYGEditorProps> = ({
  value,
  onChange,
  placeholder = 'Escribe el contenido del artículo...',
  label,
  error = false,
  helperText
}) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState(0)
  const [htmlCode, setHtmlCode] = useState(value)
  const [isInitialized, setIsInitialized] = useState(false)

  // Link dialog state
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')

  // Image dialog state
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [imageUploadError, setImageUploadError] = useState<string | null>(null)

  // Color dialog state
  const [colorDialogOpen, setColorDialogOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState('#000000')

  // Font size dialog state
  const [fontSizeDialogOpen, setFontSizeDialogOpen] = useState(false)
  const [selectedFontSize, setSelectedFontSize] = useState('16px')

  // Image upload hook
  const { uploadImage, uploading } = useImages({
    onSuccess: response => {
      setImageUrl(response.url)
      setImageUploadError(null)
    },
    onError: error => {
      setImageUploadError(error)
    }
  })

  // Initialize editor only once
  useEffect(() => {
    if (editorRef.current && !isInitialized) {
      if (!value || value.trim() === '') {
        editorRef.current.innerHTML = ''
      } else {
        editorRef.current.innerHTML = value
      }
      setHtmlCode(value)
      setIsInitialized(true)
    }
  }, [value, isInitialized])

  // Handle external value changes (not from user typing)
  useEffect(() => {
    if (editorRef.current && isInitialized && activeTab === 0) {
      // Only update if the value is different and not from user input
      if (value !== editorRef.current.innerHTML) {
        editorRef.current.innerHTML = value || ''
        setHtmlCode(value)
      }
    }
  }, [value, isInitialized, activeTab])

  const execCommand = (command: string, value?: string) => {
    editorRef.current?.focus()
    document.execCommand(command, false, value)
    
    // Update content after command
    if (editorRef.current && activeTab === 0) {
      const newContent = editorRef.current.innerHTML
      onChange(newContent)
      setHtmlCode(newContent)
    }
  }

  const handleInput = useCallback(() => {
    if (editorRef.current && activeTab === 0) {
      const newContent = editorRef.current.innerHTML
      onChange(newContent)
      setHtmlCode(newContent)
    }
  }, [activeTab, onChange])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)

    if (newValue === 1) {
      // Al cambiar a la vista HTML, actualizar el código
      const currentHtml = editorRef.current?.innerHTML || value
      setHtmlCode(currentHtml)
    } else if (newValue === 0) {
      // Al cambiar al editor, sincronizar el contenido
      if (editorRef.current && htmlCode !== editorRef.current.innerHTML) {
        editorRef.current.innerHTML = htmlCode
      }
    }
  }

  const handleHtmlChange = (newHtml: string) => {
    setHtmlCode(newHtml)
    onChange(newHtml)

    // Solo actualizar el editor si estamos en la pestaña HTML
    if (editorRef.current && activeTab === 1) {
      editorRef.current.innerHTML = newHtml
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
        setImageDialogOpen(true)
        break
      case 'color':
        setColorDialogOpen(true)
        break
      case 'fontSize':
        setFontSizeDialogOpen(true)
        break
      case 'quote':
        execCommand('formatBlock', '<blockquote>')
        break
      case 'code':
        execCommand('formatBlock', '<pre>')
        break
      case 'strikethrough':
        execCommand('strikeThrough')
        break
      case 'subscript':
        execCommand('subscript')
        break
      case 'superscript':
        execCommand('superscript')
        break
      case 'justifyLeft':
        execCommand('justifyLeft')
        break
      case 'justifyCenter':
        execCommand('justifyCenter')
        break
      case 'justifyRight':
        execCommand('justifyRight')
        break
      case 'justifyFull':
        execCommand('justifyFull')
        break
    }
  }

  const handleLinkSubmit = () => {
    if (!linkUrl.trim()) {
      alert('La URL es obligatoria')
      return
    }

    if (!linkText.trim()) {
      alert('El texto del enlace es obligatorio')
      return
    }

    const linkHTML = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`
    execCommand('insertHTML', linkHTML)

    setLinkUrl('')
    setLinkText('')
    setLinkDialogOpen(false)
  }

  const handleColorSubmit = () => {
    execCommand('foreColor', selectedColor)
    setColorDialogOpen(false)
  }

  const handleFontSizeSubmit = () => {
    execCommand('fontSize', selectedFontSize)
    setFontSizeDialogOpen(false)
  }

  const handleImageSubmit = () => {
    if (!imageUrl.trim()) {
      alert('La URL de la imagen es obligatoria')
      return
    }

    const imageHTML = `<img src="${imageUrl}" alt="${imageAlt}" style="max-width: 100%; height: auto;" />`
    execCommand('insertHTML', imageHTML)

    setImageUrl('')
    setImageAlt('')
    setImageDialogOpen(false)
  }

  const handleImageUpload = async (file: File) => {
    try {
      await uploadImage(file)
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    
    const text = e.clipboardData.getData('text/plain')
    const html = e.clipboardData.getData('text/html')

    if (html) {
      // Si hay HTML, insertarlo manteniendo la estructura pero sin estilos
      const selection = window.getSelection()
      
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        
        // Crear un elemento temporal para limpiar el HTML
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = html
        
        // Limpiar TODOS los estilos pero mantener estructura semántica
        const cleanHtml = tempDiv.innerHTML
          .replace(/<div>/g, '<p>')
          .replace(/<\/div>/g, '</p>')
          .replace(/<span[^>]*>/g, '')
          .replace(/<\/span>/g, '')
          .replace(/style="[^"]*"/g, '')
          .replace(/class="[^"]*"/g, '')
          .replace(/id="[^"]*"/g, '')
          .replace(/<[^>]*\s+style="[^"]*"[^>]*>/g, (match) => {
            return match.replace(/\s+style="[^"]*"/g, '')
          })
        
        // Insertar el HTML limpio
        const fragment = document.createRange().createContextualFragment(cleanHtml)
        range.deleteContents()
        range.insertNode(fragment)
        range.collapse(false)
        
        // Update content
        handleInput()
      }
    } else {
      // Si solo hay texto plano, insertarlo como texto
      document.execCommand('insertText', false, text)
      handleInput()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      execCommand('insertParagraph')
    }
  }

  const isFormatActive = (format: string) => {
    return document.queryCommandState(format)
  }

  return (
    <Box>
      {label && (
        <Typography variant='subtitle2' sx={{ mb: 1, color: error ? 'error.main' : 'text.primary' }}>
          {label}
        </Typography>
      )}

      <Paper
        variant='outlined'
        sx={{
          borderColor: error ? 'error.main' : undefined,
          overflow: 'hidden'
        }}
      >
        {/* Toolbar */}
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            p: 1,
            backgroundColor: 'grey.50'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            {/* Text Formatting */}
            <ToggleButtonGroup size='small' sx={{ mr: 1 }}>
              <Tooltip title='Negrita'>
                <ToggleButton
                  value='bold'
                  selected={isFormatActive('bold')}
                  onClick={() => handleFormat('bold')}
                >
                  <i className='ri-bold' />
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Cursiva'>
                <ToggleButton
                  value='italic'
                  selected={isFormatActive('italic')}
                  onClick={() => handleFormat('italic')}
                >
                  <i className='ri-italic' />
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Subrayado'>
                <ToggleButton
                  value='underline'
                  selected={isFormatActive('underline')}
                  onClick={() => handleFormat('underline')}
                >
                  <i className='ri-underline' />
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Tachado'>
                <ToggleButton value='strikethrough' onClick={() => handleFormat('strikethrough')}>
                  <i className='ri-strikethrough' />
                </ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>

            <Divider orientation='vertical' flexItem />

            {/* Headings */}
            <ToggleButtonGroup size='small' sx={{ mr: 1 }}>
              <Tooltip title='Título 1'>
                <ToggleButton value='h1' onClick={() => handleFormat('h1')}>
                  H1
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Título 2'>
                <ToggleButton value='h2' onClick={() => handleFormat('h2')}>
                  H2
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Título 3'>
                <ToggleButton value='h3' onClick={() => handleFormat('h3')}>
                  H3
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Párrafo'>
                <ToggleButton value='p' onClick={() => handleFormat('p')}>
                  P
                </ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>

            <Divider orientation='vertical' flexItem />

            {/* Lists */}
            <ToggleButtonGroup size='small' sx={{ mr: 1 }}>
              <Tooltip title='Lista con viñetas'>
                <ToggleButton value='ul' onClick={() => handleFormat('ul')}>
                  <i className='ri-list-unordered' />
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Lista numerada'>
                <ToggleButton value='ol' onClick={() => handleFormat('ol')}>
                  <i className='ri-list-ordered' />
                </ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>

            <Divider orientation='vertical' flexItem />

            {/* Alignment */}
            <ToggleButtonGroup size='small' sx={{ mr: 1 }}>
              <Tooltip title='Alinear izquierda'>
                <ToggleButton value='justifyLeft' onClick={() => handleFormat('justifyLeft')}>
                  <i className='ri-align-left' />
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Centrar'>
                <ToggleButton value='justifyCenter' onClick={() => handleFormat('justifyCenter')}>
                  <i className='ri-align-center' />
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Alinear derecha'>
                <ToggleButton value='justifyRight' onClick={() => handleFormat('justifyRight')}>
                  <i className='ri-align-right' />
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Justificar'>
                <ToggleButton value='justifyFull' onClick={() => handleFormat('justifyFull')}>
                  <i className='ri-align-justify' />
                </ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>

            <Divider orientation='vertical' flexItem />

            {/* Special Formats */}
            <ToggleButtonGroup size='small' sx={{ mr: 1 }}>
              <Tooltip title='Cita'>
                <ToggleButton value='quote' onClick={() => handleFormat('quote')}>
                  <i className='ri-double-quotes-l' />
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Código'>
                <ToggleButton value='code' onClick={() => handleFormat('code')}>
                  <i className='ri-code-line' />
                </ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>

            <Divider orientation='vertical' flexItem />

            {/* Links and Images */}
            <ToggleButtonGroup size='small'>
              <Tooltip title='Insertar enlace'>
                <ToggleButton value='link' onClick={() => handleFormat('link')}>
                  <i className='ri-link' />
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Insertar imagen'>
                <ToggleButton value='image' onClick={() => handleFormat('image')}>
                  <i className='ri-image-line' />
                </ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              minHeight: 40,
              '& .MuiTab-root': {
                minHeight: 40,
                fontSize: '14px',
                fontWeight: 500
              }
            }}
          >
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <i className='ri-edit-line' />
                  Editor
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <i className='ri-code-line' />
                  HTML
                </Box>
              }
            />
          </Tabs>
        </Box>

        {/* Editor Area */}
        {activeTab === 0 ? (
          <Box
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onPaste={handlePaste}
            onKeyDown={handleKeyDown}
            sx={{
              minHeight: 400,
              padding: 3,
              outline: 'none',
              fontFamily: 'inherit',
              fontSize: '14px',
              lineHeight: 1.6,
              '&:empty:before': {
                content: `"${placeholder}"`,
                color: 'text.disabled',
                pointerEvents: 'none'
              },
              '& p': {
                margin: '0.5em 0'
              },
              '& h1, & h2, & h3, & h4, & h5, & h6': {
                margin: '1em 0 0.5em 0',
                fontWeight: 600
              },
              '& ul, & ol': {
                margin: '0.5em 0',
                paddingLeft: '2em'
              },
              '& blockquote': {
                margin: '1em 0',
                padding: '0.5em 1em',
                borderLeft: '4px solid',
                borderColor: 'primary.main',
                backgroundColor: 'grey.50'
              },
              '& pre': {
                margin: '1em 0',
                padding: '1em',
                backgroundColor: 'grey.100',
                borderRadius: 1,
                overflow: 'auto'
              },
              '& img': {
                maxWidth: '100%',
                height: 'auto',
                margin: '1em 0'
              }
            }}
          />
        ) : (
          <TextField
            multiline
            rows={20}
            value={htmlCode}
            onChange={e => handleHtmlChange(e.target.value)}
            sx={{
              '& .MuiInputBase-root': {
                fontFamily: 'monospace',
                fontSize: '14px'
              }
            }}
          />
        )}
      </Paper>

      {helperText && (
        <Typography variant='caption' sx={{ mt: 1, color: error ? 'error.main' : 'text.secondary' }}>
          {helperText}
        </Typography>
      )}

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onClose={() => setLinkDialogOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Insertar Enlace</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            label='URL del enlace'
            type='url'
            fullWidth
            variant='outlined'
            value={linkUrl}
            onChange={e => setLinkUrl(e.target.value)}
            placeholder='https://ejemplo.com'
          />
          <TextField
            margin='dense'
            label='Texto del enlace'
            fullWidth
            variant='outlined'
            value={linkText}
            onChange={e => setLinkText(e.target.value)}
            placeholder='Texto visible del enlace'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLinkDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleLinkSubmit} variant='contained'>
            Insertar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={imageDialogOpen} onClose={() => setImageDialogOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Insertar Imagen</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            label='URL de la imagen'
            type='url'
            fullWidth
            variant='outlined'
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            placeholder='https://ejemplo.com/imagen.jpg'
          />
          <TextField
            margin='dense'
            label='Texto alternativo'
            fullWidth
            variant='outlined'
            value={imageAlt}
            onChange={e => setImageAlt(e.target.value)}
            placeholder='Descripción de la imagen'
          />
          
          <Box sx={{ mt: 2 }}>
            <Typography variant='subtitle2' sx={{ mb: 1 }}>
              O subir una imagen:
            </Typography>
            <input
              type='file'
              accept='image/*'
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) {
                  handleImageUpload(file)
                }
              }}
              style={{ display: 'none' }}
              id='image-upload'
            />
            <label htmlFor='image-upload'>
              <Button variant='outlined' component='span' disabled={uploading}>
                {uploading ? <CircularProgress size={20} /> : 'Seleccionar imagen'}
              </Button>
            </label>
            {imageUploadError && (
              <Alert severity='error' sx={{ mt: 1 }}>
                {imageUploadError}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleImageSubmit} variant='contained'>
            Insertar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Color Dialog */}
      <Dialog open={colorDialogOpen} onClose={() => setColorDialogOpen(false)} maxWidth='xs' fullWidth>
        <DialogTitle>Seleccionar Color</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            label='Color'
            type='color'
            fullWidth
            variant='outlined'
            value={selectedColor}
            onChange={e => setSelectedColor(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setColorDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleColorSubmit} variant='contained'>
            Aplicar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Font Size Dialog */}
      <Dialog open={fontSizeDialogOpen} onClose={() => setFontSizeDialogOpen(false)} maxWidth='xs' fullWidth>
        <DialogTitle>Seleccionar Tamaño de Fuente</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            label='Tamaño'
            select
            fullWidth
            variant='outlined'
            value={selectedFontSize}
            onChange={e => setSelectedFontSize(e.target.value)}
          >
            <option value='12px'>12px</option>
            <option value='14px'>14px</option>
            <option value='16px'>16px</option>
            <option value='18px'>18px</option>
            <option value='20px'>20px</option>
            <option value='24px'>24px</option>
            <option value='28px'>28px</option>
            <option value='32px'>32px</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFontSizeDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleFontSizeSubmit} variant='contained'>
            Aplicar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CursorFixedWYSIWYGEditor 