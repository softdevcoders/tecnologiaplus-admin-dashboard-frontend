import Link from 'next/link'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

export default function NotFound() {
  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant='h4' component='h1' gutterBottom>
            Artículo no encontrado
          </Typography>
          
          <Typography variant='body1' color='text.secondary' sx={{ mb: 3 }}>
            El artículo que estás buscando no existe o ha sido eliminado.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant='contained'
              component={Link}
              href='/articulos'
              startIcon={<i className='ri-arrow-left-line' />}
            >
              Volver a la lista
            </Button>
            
            <Button
              variant='outlined'
              component={Link}
              href='/articulos/crear'
              startIcon={<i className='ri-add-line' />}
            >
              Crear nuevo artículo
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
