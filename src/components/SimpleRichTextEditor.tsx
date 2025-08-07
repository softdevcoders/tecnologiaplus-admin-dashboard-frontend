'use client'

import { useState } from 'react'

import { Box, Typography, TextField, ToggleButton, ToggleButtonGroup, Paper, Divider } from '@mui/material'

interface SimpleRichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  error?: boolean
  helperText?: string
}

const SimpleRichTextEditor: React.FC<SimpleRichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Escribe el contenido del artículo...',
  label,
  error = false,
  helperText
}) => {
  const [_, setSelection] = useState({ start: 0, end: 0 }) // eslint-disable-line @typescript-eslint/no-unused-vars

  const handleFormat = (format: string) => {
    const textField = document.getElementById('rich-text-field') as HTMLTextAreaElement

    if (!textField) return

    const start = textField.selectionStart
    const end = textField.selectionEnd
    const selectedText = value.substring(start, end)

    let newText = value
    let newSelection = { start, end }

    switch (format) {
      case 'bold':
        newText = value.substring(0, start) + `**${selectedText}**` + value.substring(end)
        newSelection = { start: start + 2, end: end + 2 }
        break
      case 'italic':
        newText = value.substring(0, start) + `*${selectedText}*` + value.substring(end)
        newSelection = { start: start + 1, end: end + 1 }
        break
      case 'underline':
        newText = value.substring(0, start) + `<u>${selectedText}</u>` + value.substring(end)
        newSelection = { start: start + 3, end: end + 3 }
        break
      case 'h1':
        newText = value.substring(0, start) + `# ${selectedText}` + value.substring(end)
        newSelection = { start: start + 2, end: end + 2 }
        break
      case 'h2':
        newText = value.substring(0, start) + `## ${selectedText}` + value.substring(end)
        newSelection = { start: start + 3, end: end + 3 }
        break
      case 'h3':
        newText = value.substring(0, start) + `### ${selectedText}` + value.substring(end)
        newSelection = { start: start + 4, end: end + 4 }
        break
      case 'list':
        const lines = selectedText.split('\n')
        const listText = lines.map(line => `- ${line}`).join('\n')

        newText = value.substring(0, start) + listText + value.substring(end)
        newSelection = { start, end: start + listText.length }
        break
      case 'link':
        const url = prompt('Ingresa la URL:')

        if (url) {
          newText = value.substring(0, start) + `[${selectedText}](${url})` + value.substring(end)
          newSelection = { start: start + 1, end: start + selectedText.length + 1 }
        }

        break
    }

    onChange(newText)

    // Restaurar selección después del cambio
    setTimeout(() => {
      const textField = document.getElementById('rich-text-field') as HTMLTextAreaElement

      if (textField) {
        textField.setSelectionRange(newSelection.start, newSelection.end)
        textField.focus()
      }
    }, 0)
  }

  const handleSelectionChange = () => {
    const textField = document.getElementById('rich-text-field') as HTMLTextAreaElement

    if (textField) {
      setSelection({ start: textField.selectionStart, end: textField.selectionEnd })
    }
  }

  return (
    <Box>
      {label && (
        <Typography variant='subtitle2' sx={{ mb: 1, color: error ? 'error.main' : 'text.primary' }}>
          {label}
        </Typography>
      )}

      <Paper variant='outlined' sx={{ borderColor: error ? 'error.main' : undefined }}>
        {/* Toolbar */}
        <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
          <ToggleButtonGroup size='small' sx={{ flexWrap: 'wrap' }}>
            <ToggleButton value='h1' onClick={() => handleFormat('h1')} title='Título 1'>
              H1
            </ToggleButton>
            <ToggleButton value='h2' onClick={() => handleFormat('h2')} title='Título 2'>
              H2
            </ToggleButton>
            <ToggleButton value='h3' onClick={() => handleFormat('h3')} title='Título 3'>
              H3
            </ToggleButton>
            <Divider orientation='vertical' flexItem />
            <ToggleButton value='bold' onClick={() => handleFormat('bold')} title='Negrita'>
              <strong>B</strong>
            </ToggleButton>
            <ToggleButton value='italic' onClick={() => handleFormat('italic')} title='Cursiva'>
              <em>I</em>
            </ToggleButton>
            <ToggleButton value='underline' onClick={() => handleFormat('underline')} title='Subrayado'>
              <u>U</u>
            </ToggleButton>
            <Divider orientation='vertical' flexItem />
            <ToggleButton value='list' onClick={() => handleFormat('list')} title='Lista'>
              •
            </ToggleButton>
            <ToggleButton value='link' onClick={() => handleFormat('link')} title='Enlace'>
              🔗
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Text Area */}
        <TextField
          id='rich-text-field'
          multiline
          rows={5}
          value={value}
          onChange={e => onChange(e.target.value)}
          onSelect={handleSelectionChange}
          placeholder={placeholder}
          variant='standard'
          fullWidth
          sx={{
            '& .MuiInputBase-root': {
              border: 'none',
              '&:before, &:after': {
                display: 'none'
              }
            },
            '& .MuiInputBase-input': {
              padding: 2,
              minHeight: 100,
              fontFamily: 'monospace',
              fontSize: '14px',
              lineHeight: 1.6
            }
          }}
        />
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

      <Typography variant='caption' color='text.secondary' sx={{ mt: 1, display: 'block' }}>
        <strong>Formato disponible:</strong> **negrita**, *cursiva*, &lt;u&gt;subrayado&lt;/u&gt;, # título, - lista,
        [texto](url)
      </Typography>
    </Box>
  )
}

export default SimpleRichTextEditor
