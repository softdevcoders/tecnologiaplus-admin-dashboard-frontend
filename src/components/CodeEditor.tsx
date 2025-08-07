'use client'

import { useState, useEffect, useRef } from 'react'
import { Box, TextField, Typography, Button, Paper } from '@mui/material'
import Prism from 'prismjs'
import '@/styles/prism-theme.css'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-javascript'
import 'prismjs/plugins/line-numbers/prism-line-numbers'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  placeholder?: string
  label?: string
  error?: boolean
  helperText?: string
  minHeight?: number
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'markup',
  placeholder = 'Escribe tu código aquí...',
  label,
  error = false,
  helperText,
  minHeight = 400
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [formattedValue, setFormattedValue] = useState(value)
  const codeRef = useRef<HTMLPreElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setEditValue(value)
    if (language === 'markup') {
      setFormattedValue(formatHtmlCode(value))
    } else {
      setFormattedValue(value)
    }
  }, [value, language])

  useEffect(() => {
    if (codeRef.current && !isEditing) {
      Prism.highlightElement(codeRef.current)
    }
  }, [formattedValue, isEditing])

  const handleEditClick = () => {
    setIsEditing(true)
    setEditValue(value)
    // Enfocar el textarea después de un pequeño delay
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 100)
  }

  const handleSaveClick = () => {
    setIsEditing(false)
    onChange(editValue)
  }

  const handleCancelClick = () => {
    setIsEditing(false)
    setEditValue(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const target = e.target as HTMLTextAreaElement
      const start = target.selectionStart
      const end = target.selectionEnd

      // Insertar tabulación
      const newValue = editValue.substring(0, start) + '  ' + editValue.substring(end)
      setEditValue(newValue)

      // Mover cursor después de la tabulación
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2
      }, 0)
    } else if (e.key === 'Escape') {
      handleCancelClick()
    } else if (e.key === 'Enter' && e.ctrlKey) {
      handleSaveClick()
    }
  }

  const handleViewKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault()
      copyToClipboard()
    }
  }

  const formatHtmlCode = (html: string): string => {
    if (!html.trim()) return '<p></p>'

    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')

      // Función recursiva para formatear elementos
      const formatElement = (element: Element, indent: number = 0): string => {
        const spaces = '  '.repeat(indent)
        let result = ''

        if (element.nodeType === Node.TEXT_NODE) {
          const text = element.textContent?.trim()
          if (text) {
            result += spaces + text + '\n'
          }
        } else if (element.nodeType === Node.ELEMENT_NODE) {
          const tagName = element.tagName.toLowerCase()
          const hasChildren = element.children.length > 0
          const hasText = element.textContent?.trim()

          if (hasChildren || hasText) {
            result += spaces + `<${tagName}`

            // Agregar atributos
            for (let i = 0; i < element.attributes.length; i++) {
              const attr = element.attributes[i]
              result += ` ${attr.name}="${attr.value}"`
            }

            result += '>\n'

            // Procesar hijos
            for (let i = 0; i < element.children.length; i++) {
              result += formatElement(element.children[i], indent + 1)
            }

            // Procesar texto directo
            if (hasText && !hasChildren) {
              result += '  '.repeat(indent + 1) + hasText + '\n'
            }

            result += spaces + `</${tagName}>\n`
          } else {
            result += spaces + `<${tagName}`

            // Agregar atributos
            for (let i = 0; i < element.attributes.length; i++) {
              const attr = element.attributes[i]
              result += ` ${attr.name}="${attr.value}"`
            }

            result += ' />\n'
          }
        }

        return result
      }

      // Formatear todo el contenido
      let formatted = ''
      for (let i = 0; i < doc.body.children.length; i++) {
        formatted += formatElement(doc.body.children[i])
      }

      // Limpiar líneas vacías extra
      formatted = formatted
        .split('\n')
        .filter(line => line.trim().length > 0)
        .join('\n')
        .trim()

      return formatted
    } catch (error) {
      console.error('Error al formatear HTML:', error)
      return html // Retornar HTML original si hay error
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value)
      // Aquí podrías mostrar una notificación de éxito
    } catch (error) {
      console.error('Error al copiar al portapapeles:', error)
    }
  }

  const formatCode = () => {
    try {
      if (language === 'markup') {
        const formatted = formatHtmlCode(editValue)
        setEditValue(formatted)
      }
    } catch (error) {
      console.error('Error al formatear código:', error)
    }
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
            backgroundColor: 'grey.50',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant='caption' color='text.secondary'>
            <strong>Lenguaje:</strong> {language === 'markup' ? 'HTML' : language.toUpperCase()}
            {language === 'markup' && (
              <>
                <span style={{ marginLeft: '8px' }}>
                  <strong>Etiquetas:</strong> h1-h3, p, ul/ol, blockquote, code, a, img, article, section, header,
                  footer
                </span>
                <span style={{ marginLeft: '8px', color: '#4caf50' }}>
                  <i className='ri-check-line' style={{ marginRight: '4px' }} />
                  Formateado automáticamente
                </span>
              </>
            )}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {isEditing ? (
              <>
                <Button
                  size='small'
                  variant='outlined'
                  onClick={formatCode}
                  startIcon={<i className='ri-indent-increase' />}
                >
                  Formatear
                </Button>
                <Button size='small' variant='outlined' onClick={handleCancelClick}>
                  Cancelar
                </Button>
                <Button size='small' variant='contained' onClick={handleSaveClick}>
                  Guardar
                </Button>
              </>
            ) : (
              <>
                <Button
                  size='small'
                  variant='outlined'
                  onClick={copyToClipboard}
                  startIcon={<i className='ri-file-copy-line' />}
                >
                  Copiar
                </Button>
                <Button
                  size='small'
                  variant='outlined'
                  onClick={handleEditClick}
                  startIcon={<i className='ri-edit-line' />}
                >
                  Editar
                </Button>
              </>
            )}
          </Box>
        </Box>

        {/* Code Area */}
        <Box sx={{ position: 'relative' }}>
          {isEditing ? (
            <TextField
              ref={textareaRef}
              multiline
              fullWidth
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              sx={{
                minHeight,
                '& .MuiInputBase-root': {
                  minHeight,
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  lineHeight: 1.5,
                  backgroundColor: '#f5f5f5'
                },
                '& .MuiInputBase-input': {
                  padding: 3,
                  tabSize: 2
                }
              }}
            />
          ) : (
            <Box
              onKeyDown={handleViewKeyDown}
              tabIndex={0}
              sx={{
                minHeight,
                maxHeight: 600,
                overflow: 'auto',
                backgroundColor: '#f5f5f5',
                position: 'relative',
                outline: 'none',
                '&:focus': {
                  outline: '2px solid #1976d2',
                  outlineOffset: '2px'
                }
              }}
            >
              <pre
                ref={codeRef}
                className={`language-${language} line-numbers`}
                style={{
                  margin: 0,
                  padding: '12px',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word'
                }}
              >
                {formattedValue || (language === 'markup' ? '<p></p>' : placeholder)}
              </pre>
            </Box>
          )}
        </Box>
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

      {/* Keyboard shortcuts info */}
      <Typography variant='caption' color='text.secondary' sx={{ mt: 1, display: 'block' }}>
        <strong>Atajos:</strong>
        {isEditing ? ' Tab (indentar), Ctrl+Enter (guardar), Esc (cancelar)' : ' Ctrl+C (copiar), Ctrl+V (pegar)'}
      </Typography>
    </Box>
  )
}

export default CodeEditor
