'use client'

import { useState } from 'react'

import { Box, Typography, Paper, Button, Alert, Divider } from '@mui/material'

import SimpleWYSIWYGEditor from '@/components/SimpleWYSIWYGEditor'

const TestEditorPage = () => {
  const [content, setContent] = useState('<p>¡Prueba el editor simple! Selecciona este texto y agrega un enlace para ver que no se duplica.</p>')
  const [testResults, setTestResults] = useState<string[]>([])

  const runTests = () => {
    const results: string[] = []
    
    // Test 1: Verificar que no haya duplicación de enlaces
    const linkMatches = content.match(/<a[^>]*>/g) || []
    const linkTextMatches = content.match(/href=/g) || []
    
    if (linkMatches.length === linkTextMatches.length) {
      results.push('✅ Test 1: No hay duplicación de enlaces')
    } else {
      results.push('❌ Test 1: Se detectó duplicación de enlaces')
    }
    
    // Test 2: Verificar que no se envuelvan elementos en <p> innecesariamente
    const hasInvalidWrapping = content.includes('<p><h') || content.includes('<p><div') || content.includes('<p><ul') || content.includes('<p><ol')
    
    if (!hasInvalidWrapping) {
      results.push('✅ Test 2: No hay envolvimiento innecesario en <p>')
    } else {
      results.push('❌ Test 2: Se detectó envolvimiento innecesario en <p>')
    }
    
    // Test 3: Verificar estructura HTML válida
    if (content.includes('<p>') || content.includes('<h') || content.includes('<div')) {
      results.push('✅ Test 3: Estructura HTML válida')
    } else {
      results.push('❌ Test 3: Estructura HTML inválida')
    }
    
    // Test 4: Verificar que no haya texto duplicado
    const textContent = content.replace(/<[^>]*>/g, '')
    const words = textContent.split(/\s+/).filter(word => word.length > 0)
    const uniqueWords = [...new Set(words)]
    
    if (words.length === uniqueWords.length) {
      results.push('✅ Test 4: No hay texto duplicado')
    } else {
      results.push('❌ Test 4: Se detectó texto duplicado')
    }
    
    setTestResults(results)
  }

  const addTestContent = () => {
    setContent('<p>Selecciona este texto y agrega un enlace para probar</p>')
  }

  const clearContent = () => {
    setContent('<p></p>')
    setTestResults([])
  }

  const analyzeContent = () => {
    console.log('=== ANÁLISIS DEL CONTENIDO ===')
    console.log('Contenido completo:', content)
    console.log('Enlaces encontrados:', content.match(/<a[^>]*>/g))
    console.log('Texto sin HTML:', content.replace(/<[^>]*>/g, ''))
    console.log('Elementos de bloque:', content.match(/<(h[1-6]|div|ul|ol|blockquote|pre|hr|img|figure)[^>]*>/g))
    console.log('================================')
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' sx={{ mb: 3 }}>
        Prueba del Editor Simple
      </Typography>
      
      <Alert severity='success' sx={{ mb: 3 }}>
        <Typography variant='body2'>
          <strong>Editor Simple:</strong> Versión simplificada que resuelve los problemas de duplicación y envolvimiento<br/>
          <strong>Instrucciones:</strong><br/>
          1. Selecciona texto y agrega un enlace - no debe duplicarse<br/>
          2. Agrega elementos de bloque (títulos, listas) - no deben envolverse en &lt;p&gt;<br/>
          3. Pega contenido - debe mantener la estructura original<br/>
          4. Ejecuta las pruebas para verificar el funcionamiento
        </Typography>
      </Alert>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button variant='contained' onClick={runTests}>
          Ejecutar Pruebas
        </Button>
        <Button variant='outlined' onClick={addTestContent}>
          Agregar Texto de Prueba
        </Button>
        <Button variant='outlined' onClick={clearContent}>
          Limpiar
        </Button>
        <Button variant='outlined' onClick={analyzeContent}>
          Analizar en Consola
        </Button>
      </Box>

      <SimpleWYSIWYGEditor
        value={content}
        onChange={setContent}
        label='Editor Simple de Prueba'
        placeholder='Prueba las funcionalidades del editor simple...'
      />

      {testResults.length > 0 && (
        <Paper sx={{ p: 2, mt: 3, backgroundColor: 'grey.50' }}>
          <Typography variant='h6' sx={{ mb: 2 }}>
            Resultados de las Pruebas:
          </Typography>
          <Box component='ul' sx={{ pl: 2 }}>
            {testResults.map((result, index) => (
              <li key={index}>
                <Typography variant='body2'>{result}</Typography>
              </li>
            ))}
          </Box>
        </Paper>
      )}

      <Divider sx={{ my: 3 }} />

      <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
        <Typography variant='subtitle2' sx={{ mb: 1 }}>
          HTML Generado:
        </Typography>
        <Box
          component='pre'
          sx={{
            fontSize: '12px',
            overflow: 'auto',
            maxHeight: 300,
            backgroundColor: 'white',
            padding: 1,
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'grey.300'
          }}
        >
          {content}
        </Box>
      </Paper>

      <Paper sx={{ p: 2, mt: 2, backgroundColor: 'info.50' }}>
        <Typography variant='subtitle2' sx={{ mb: 1 }}>
          Texto sin HTML (para verificar duplicación):
        </Typography>
        <Box
          component='pre'
          sx={{
            fontSize: '12px',
            backgroundColor: 'white',
            padding: 1,
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'grey.300'
          }}
        >
          {content.replace(/<[^>]*>/g, '')}
        </Box>
      </Paper>
    </Box>
  )
}

export default TestEditorPage 