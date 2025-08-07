'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

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
  Tooltip,
  Tabs,
  Tab,
  Alert,
  CircularProgress
} from '@mui/material'

import CodeEditor from './CodeEditor'
import { useImages } from '@/hooks/useImages'
import { useAuth } from '@/hooks/useAuth'
import { generatePictureElement } from '@/utils/cloudinary'
import { useNotification } from '@/contexts/NotificationContext'

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
  helperText
}) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [colorDialogOpen, setColorDialogOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState('#000000')
  const [fontSizeDialogOpen, setFontSizeDialogOpen] = useState(false)
  const [selectedFontSize, setSelectedFontSize] = useState('16px')
  const [activeTab, setActiveTab] = useState(0) // 0 = Editor, 1 = HTML
  const [htmlCode, setHtmlCode] = useState(value)
  const [imageUploadError, setImageUploadError] = useState<string | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [uploadedImagePublicId, setUploadedImagePublicId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { showError } = useNotification()

  // Cloudinary integration
  const { session } = useAuth()
  const sessionId = session?.user?.id || session?.user?.email || 'anonymous'

  const {
    uploading: imageUploading,
    uploadContentImage,
    clearError
  } = useImages({
    sessionId,
    onSuccess: response => {
      // Guardar la URL y publicId de la imagen subida y mantener el modal abierto
      setUploadedImageUrl(response.url)
      setUploadedImagePublicId(response.publicId)
      setImageUrl(response.url)
      setImageUploadError(null)
    },
    onError: error => {
      setImageUploadError(error)
    }
  })

  useEffect(() => {
    // Solo actualizar si estamos en la pestaña del editor y hay un cambio real
    if (editorRef.current && activeTab === 0 && value !== editorRef.current.innerHTML) {
      const selection = window.getSelection()
      const range = selection?.getRangeAt(0)
      const wasAtEnd = range && range.endOffset === range.endContainer.textContent?.length

      // Si el valor está vacío, inicializar con un párrafo vacío
      if (!value || value.trim() === '') {
        editorRef.current.innerHTML = '<p></p>'
        setHtmlCode('<p></p>')
      } else {
        editorRef.current.innerHTML = value
        setHtmlCode(value)
      }

      // Restaurar cursor al final si estaba al final
      if (wasAtEnd && editorRef.current.textContent) {
        const newRange = document.createRange()

        newRange.selectNodeContents(editorRef.current)
        newRange.collapse(false)
        selection?.removeAllRanges()
        selection?.addRange(newRange)
      }
    }
  }, [value, activeTab])

  // Inicializar con un párrafo cuando el componente se monta
  useEffect(() => {
    if (editorRef.current && (!value || value.trim() === '')) {
      editorRef.current.innerHTML = '<p></p>'
      setHtmlCode('<p></p>')
      onChange('<p></p>')
    }
  }, []) // Solo se ejecuta al montar

  const execCommand = (command: string, value?: string) => {
    // Asegurar que el editor tenga el foco
    editorRef.current?.focus()
    
    if (command === 'insertHTML' && value) {
      // Usar una función más robusta para insertar HTML
      insertHTML(value)
    } else {
      document.execCommand(command, false, value)
    }
    
    updateContent()
  }

  const insertHTML = (html: string) => {
    if (!editorRef.current) {
      showError('❌ Editor ref no disponible')
      
      return
    }

    // Asegurar que el editor tenga el foco
    editorRef.current.focus()

    const selection = window.getSelection()

    if (!selection || selection.rangeCount === 0) {
      // Si no hay selección, insertar al final
      editorRef.current.innerHTML += html
      
      return
    }

    const range = selection.getRangeAt(0)

    range.deleteContents()
    
    const tempDiv = document.createElement('div')
    
    tempDiv.innerHTML = html
    
    const fragment = document.createDocumentFragment()

    while (tempDiv.firstChild) {
      fragment.appendChild(tempDiv.firstChild)
    }
    
    range.insertNode(fragment)
    range.collapse(false)
    selection.removeAllRanges()
    selection.addRange(range)
  }

  const updateContent = () => {
    if (editorRef.current && activeTab === 0) {
      // Solo actualizar si estamos en la pestaña del editor
      let newContent = editorRef.current.innerHTML

      // Si el contenido está vacío, crear un párrafo vacío
      if (!newContent || newContent.trim() === '' || newContent === '<br>') {
        newContent = '<p></p>'
        editorRef.current.innerHTML = newContent
      }

      onChange(newContent)
      setHtmlCode(newContent)
    }
  }

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

        // Asegurar que siempre haya al menos un párrafo
        setTimeout(() => {
          if (editorRef.current && !editorRef.current.querySelector('p')) {
            editorRef.current.innerHTML = '<p></p>'
            updateContent()
          }
        }, 0)
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
      case 'article':
        execCommand('formatBlock', '<article>')
        break
      case 'section':
        execCommand('formatBlock', '<section>')
        break
      case 'header':
        execCommand('formatBlock', '<header>')
        break
      case 'footer':
        execCommand('formatBlock', '<footer>')
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

  const handleColorSubmit = () => {
    execCommand('foreColor', selectedColor)
    setColorDialogOpen(false)
  }

  const handleFontSizeSubmit = () => {
    execCommand('fontSize', selectedFontSize.replace('px', ''))
    setFontSizeDialogOpen(false)
  }

  const handleImageSubmit = () => {
    if (!imageAlt.trim()) {
      showError('El texto alternativo (alt) es obligatorio para la accesibilidad y SEO.')
      
      return
    }

    if (imageUrl || uploadedImageUrl) {
      const finalImageUrl = imageUrl || uploadedImageUrl
      
      // Si es una URL de Cloudinary y tenemos publicId, generar picture element
      if (finalImageUrl && finalImageUrl.includes('res.cloudinary.com') && uploadedImagePublicId) {
        const pictureElement = generatePictureElement(finalImageUrl, uploadedImagePublicId, imageAlt, {
          desktopWidth: 1000,
          tabletWidth: 600,
          mobileWidth: 400
        })

        execCommand('insertHTML', pictureElement)
      } else if (finalImageUrl) {
        // URL externa, usar img simple
        const imageHtml = `<img src="${finalImageUrl}" alt="${imageAlt}" style="max-width: 100%; height: auto;" />`

        execCommand('insertHTML', imageHtml)
      }

      setImageDialogOpen(false)
      setImageUrl('')
      setImageAlt('')
      setUploadedImageUrl(null)
      setUploadedImagePublicId(null)
      setImageUploadError(null)
    }
  }

  const handleImageUpload = useCallback(
    async (file: File) => {
      setImageUploadError(null)
      clearError()

      const result = await uploadContentImage(file)

      if (!result) {
        // El error ya se maneja en el hook
        showError('Error al subir la imagen. Por favor, intenta de nuevo.')
        
        return
      }
    },
    [uploadContentImage, clearError]
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files

      if (files && files.length > 0) {
        handleImageUpload(files[0])
      }
    },
    [handleImageUpload]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()

      const files = Array.from(e.dataTransfer.files)

      if (files.length > 0) {
        handleImageUpload(files[0])
      }
    },
    [handleImageUpload]
  )

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')

    document.execCommand('insertText', false, text)
    updateContent()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()

      // Si estamos dentro de un párrafo, crear uno nuevo
      const selection = window.getSelection()

      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const currentNode = range.startContainer

        // Buscar el elemento padre más cercano
        const parentElement =
          currentNode.nodeType === Node.TEXT_NODE ? currentNode.parentElement : (currentNode as Element)

        // Si estamos en un párrafo, crear uno nuevo después
        if (parentElement && parentElement.tagName.toLowerCase() === 'p') {
          const newP = document.createElement('p')

          newP.innerHTML = ''

          // Insertar después del párrafo actual
          parentElement.parentNode?.insertBefore(newP, parentElement.nextSibling)

          // Mover cursor al nuevo párrafo
          const newRange = document.createRange()

          newRange.setStart(newP, 0)
          newRange.collapse(true)
          selection.removeAllRanges()
          selection.addRange(newRange)

          updateContent()
        } else {
          // Comportamiento por defecto
          execCommand('insertParagraph')
        }
      }
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
            p: 1,
            borderBottom: 1,
            borderColor: 'divider',
            backgroundColor: 'grey.50'
          }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
            {/* Text Format */}
            <ToggleButtonGroup size='small' sx={{ mr: 1 }}>
              <Tooltip title='Negrita'>
                <ToggleButton value='bold' onClick={() => handleFormat('bold')} selected={isFormatActive('bold')}>
                  <strong>B</strong>
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Cursiva'>
                <ToggleButton value='italic' onClick={() => handleFormat('italic')} selected={isFormatActive('italic')}>
                  <em>I</em>
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Subrayado'>
                <ToggleButton
                  value='underline'
                  onClick={() => handleFormat('underline')}
                  selected={isFormatActive('underline')}
                >
                  <u>U</u>
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Tachado'>
                <ToggleButton
                  value='strikethrough'
                  onClick={() => handleFormat('strikethrough')}
                  selected={isFormatActive('strikeThrough')}
                >
                  <s>S</s>
                </ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>

            <Divider orientation='vertical' flexItem />

            {/* Headers */}
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
                  •
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Lista numerada'>
                <ToggleButton value='ol' onClick={() => handleFormat('ol')}>
                  1.
                </ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>

            <Divider orientation='vertical' flexItem />

            {/* Alignment */}
            <ToggleButtonGroup size='small' sx={{ mr: 1 }}>
              <Tooltip title='Alinear izquierda'>
                <ToggleButton value='alignLeft' onClick={() => handleFormat('alignLeft')}>
                  <i className='ri-align-left' />
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Centrar'>
                <ToggleButton value='alignCenter' onClick={() => handleFormat('alignCenter')}>
                  <i className='ri-align-center' />
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Alinear derecha'>
                <ToggleButton value='alignRight' onClick={() => handleFormat('alignRight')}>
                  <i className='ri-align-right' />
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Justificar'>
                <ToggleButton value='alignJustify' onClick={() => handleFormat('alignJustify')}>
                  <i className='ri-align-justify' />
                </ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>

            <Divider orientation='vertical' flexItem />

            {/* Color and Font Size */}
            <ToggleButtonGroup size='small' sx={{ mr: 1 }}>
              <Tooltip title='Color de texto'>
                <ToggleButton value='color' onClick={() => handleFormat('color')}>
                  <i className='ri-palette-line' />
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Tamaño de fuente'>
                <ToggleButton value='fontSize' onClick={() => handleFormat('fontSize')}>
                  <i className='ri-font-size' />
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

            {/* Semantic HTML */}
            <ToggleButtonGroup size='small' sx={{ mr: 1 }}>
              <Tooltip title='Artículo (article)'>
                <ToggleButton value='article' onClick={() => handleFormat('article')}>
                  <i className='ri-article-line' />
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Sección (section)'>
                <ToggleButton value='section' onClick={() => handleFormat('section')}>
                  <i className='ri-layout-line' />
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Encabezado (header)'>
                <ToggleButton value='header' onClick={() => handleFormat('header')}>
                  <i className='ri-heading' />
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Pie (footer)'>
                <ToggleButton value='footer' onClick={() => handleFormat('footer')}>
                  <i className='ri-footer-line' />
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
            onInput={updateContent}
            onPaste={handlePaste}
            onKeyDown={handleKeyDown}
            onBlur={updateContent}
            sx={{
              minHeight: 400,
              padding: 3,
              outline: 'none',
              fontSize: '16px',
              lineHeight: 1.6,
              fontFamily: 'inherit',
              '& p:empty:before': {
                content: `"${placeholder}"`,
                color: '#999',
                fontStyle: 'italic',
                display: 'block',
                pointerEvents: 'none'
              },
              '& p:empty:focus:before': {
                content: 'none'
              },
              '& h1': {
                fontSize: '2em',
                fontWeight: 'bold',
                margin: '0.67em 0'
              },
              '& h2': {
                fontSize: '1.5em',
                fontWeight: 'bold',
                margin: '0.83em 0'
              },
              '& h3': {
                fontSize: '1.17em',
                fontWeight: 'bold',
                margin: '1em 0'
              },
              '& p': {
                margin: '1em 0'
              },
              '& ul, & ol': {
                margin: '1em 0',
                paddingLeft: '2em'
              },
              '& li': {
                margin: '0.5em 0'
              },
              '& a': {
                color: 'primary.main',
                textDecoration: 'underline'
              },
              '& img': {
                maxWidth: '100%',
                height: 'auto',
                margin: '1em 0'
              },
              '& blockquote': {
                borderLeft: '4px solid',
                borderColor: 'primary.main',
                paddingLeft: '1em',
                margin: '1em 0',
                fontStyle: 'italic',
                color: 'text.secondary'
              },
              '& pre': {
                backgroundColor: 'grey.100',
                padding: '1em',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '14px',
                overflow: 'auto',
                margin: '1em 0'
              },
              '& code': {
                backgroundColor: 'grey.100',
                padding: '0.2em 0.4em',
                borderRadius: '3px',
                fontFamily: 'monospace',
                fontSize: '0.9em'
              },
              '& article': {
                margin: '1em 0',
                padding: '1em',
                border: '1px solid',
                borderColor: 'primary.main',
                borderRadius: '4px'
              },
              '& section': {
                margin: '1em 0',
                padding: '1em',
                backgroundColor: 'grey.50',
                borderRadius: '4px'
              },
              '& header': {
                margin: '1em 0',
                padding: '1em',
                backgroundColor: 'primary.50',
                borderBottom: '2px solid',
                borderColor: 'primary.main'
              },
              '& footer': {
                margin: '1em 0',
                padding: '1em',
                backgroundColor: 'grey.100',
                borderTop: '2px solid',
                borderColor: 'grey.300',
                fontSize: '0.9em',
                color: 'text.secondary'
              }
            }}
          />
        ) : (
          <CodeEditor
            value={htmlCode}
            onChange={handleHtmlChange}
            language='markup'
            placeholder='Código HTML del contenido...'
            minHeight={400}
          />
        )}
      </Paper>

      {helperText && (
        <Typography
          variant='caption'
          color={error ? 'error.main' : 'text.secondary'}
          sx={{ mt: 0.5, display: 'block' }}
        >
          {helperText}
        </Typography>
      )}

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onClose={() => setLinkDialogOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Insertar Enlace</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label='Texto del enlace'
            value={linkText}
            onChange={e => setLinkText(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label='URL del enlace'
            value={linkUrl}
            onChange={e => setLinkUrl(e.target.value)}
            placeholder='https://ejemplo.com'
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
          <Box sx={{ mb: 3 }}>
            <Typography variant='subtitle2' sx={{ mb: 1 }}>
              Subir imagen desde tu computadora
            </Typography>
            <Paper
              variant='outlined'
              sx={{
                border: '2px dashed',
                borderColor: 'primary.main',
                backgroundColor: 'primary.50',
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'primary.100',
                  borderColor: 'primary.dark'
                }
              }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {imageUploading ? (
                <CircularProgress size={40} />
              ) : (
                <>
                  <i className='ri-image-line' style={{ fontSize: '48px', color: '#1976d2', marginBottom: '16px' }} />
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                    Arrastra una imagen aquí o haz clic para seleccionar
                  </Typography>
                  <Typography variant='caption' color='text.secondary'>
                    PNG, JPG, WebP, GIF, SVG, TIFF hasta 8MB
                  </Typography>
                </>
              )}
            </Paper>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </Box>

          <Divider sx={{ my: 2 }}>
            <Typography variant='body2' color='text.secondary'>
              O insertar desde URL
            </Typography>
          </Divider>

          {/* Mostrar imagen subida */}
          {uploadedImageUrl && (
            <Box sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'success.main', borderRadius: 1, bgcolor: 'success.50' }}>
              <Typography variant='subtitle2' color='success.main' sx={{ mb: 1 }}>
                ✅ Imagen subida exitosamente
              </Typography>
              <Box
                component='img'
                src={uploadedImageUrl}
                alt='Vista previa'
                sx={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain' }}
              />
            </Box>
          )}

          <TextField
            fullWidth
            label='URL de la imagen'
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            placeholder='https://ejemplo.com/imagen.jpg'
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label='Texto alternativo (alt) *'
            value={imageAlt}
            onChange={e => setImageAlt(e.target.value)}
            placeholder='Descripción de la imagen'
            helperText='Importante para SEO y accesibilidad'
            required
            error={!imageAlt.trim()}
          />

          {imageUploadError && (
            <Alert severity='error' sx={{ mt: 2 }}>
              {imageUploadError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setImageDialogOpen(false)
            setImageUrl('')
            setImageAlt('')
            setUploadedImageUrl(null)
            setUploadedImagePublicId(null)
            setImageUploadError(null)
          }}>
            Cancelar
          </Button>
          <Button 
            onClick={handleImageSubmit} 
            variant='contained' 
            disabled={(!imageUrl && !uploadedImageUrl) || !imageAlt.trim()}
          >
            {uploadedImageUrl ? 'Insertar imagen subida' : 'Insertar desde URL'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Color Dialog */}
      <Dialog open={colorDialogOpen} onClose={() => setColorDialogOpen(false)} maxWidth='xs' fullWidth>
        <DialogTitle>Seleccionar Color</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label='Color (hex)'
              value={selectedColor}
              onChange={e => setSelectedColor(e.target.value)}
              placeholder='#000000'
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {[
                '#000000',
                '#FF0000',
                '#00FF00',
                '#0000FF',
                '#FFFF00',
                '#FF00FF',
                '#00FFFF',
                '#FFA500',
                '#800080',
                '#008000'
              ].map(color => (
                <Box
                  key={color}
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: color,
                    border: '2px solid',
                    borderColor: selectedColor === color ? 'primary.main' : 'grey.300',
                    borderRadius: 1,
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'primary.main'
                    }
                  }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </Box>
          </Box>
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
        <DialogTitle>Tamaño de Fuente</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label='Tamaño (px)'
              value={selectedFontSize}
              onChange={e => setSelectedFontSize(e.target.value)}
              placeholder='16px'
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'].map(size => (
                <Button
                  key={size}
                  variant={selectedFontSize === size ? 'contained' : 'outlined'}
                  onClick={() => setSelectedFontSize(size)}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  {size}
                </Button>
              ))}
            </Box>
          </Box>
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

export default WYSIWYGEditor
