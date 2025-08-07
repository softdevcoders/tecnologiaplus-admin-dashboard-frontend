import { useState, useEffect } from 'react'

import type { Tag } from '@/services/tags.service';
import { tagsService } from '@/services/tags.service'

export const useTags = () => {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTags = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await tagsService.getTags()

      if (response.data) {
        setTags(response.data.data)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener etiquetas'

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const createTag = async (name: string) => {
    try {
      const response = await tagsService.createTag({ name })

      if (response.data) {
        setTags(prev => [...prev, response.data])
        
return response.data
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear etiqueta'

      setError(errorMessage)
      throw err
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  return {
    tags,
    loading,
    error,
    fetchTags,
    createTag
  }
}
