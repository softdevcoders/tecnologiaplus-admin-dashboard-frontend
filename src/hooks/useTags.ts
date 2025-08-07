import { useState, useEffect } from 'react'

import type { Tag } from '@/services/tags.service';
import { tagsService } from '@/services/tags.service'
import { useNotification } from '@/contexts/NotificationContext'
import { generateSlug } from '@/utils/slug'

export const useTags = () => {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { showSuccess, showError } = useNotification()

  const fetchTags = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await tagsService.getTags()

      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setTags(response.data.data)
      } else {
        setTags([])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener etiquetas'

      setError(errorMessage)
      showError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const createTag = async (name: string) => {
    try {
      const slug = generateSlug(name)
      
      const response = await tagsService.createTag({ name, slug })

      if (response.data) {
        setTags(prev => {
          const prevArray = Array.isArray(prev) ? prev : []

          return [...prevArray, response.data]
        })
        showSuccess(`Etiqueta "${name}" creada exitosamente`)

        return response.data
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear etiqueta'

      setError(errorMessage)
      showError(errorMessage)
      throw err
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  return {
    tags: tags || [],
    loading,
    error,
    fetchTags,
    createTag
  }
}
