import { useState, useEffect, useCallback } from 'react'

import type { Category } from '@/services/categories.service'
import categoriesService from '@/services/categories.service'

interface UseCategoriesReturn {
  categories: Category[]
  loading: boolean
  error: string | null
  fetchCategories: () => Promise<void>
}

export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await categoriesService.getCategories()

      if (response.success) {
        setCategories(response.data || [])
      } else {
        setCategories([])
      }
    } catch (err) {
      console.error('Error al obtener categorías:', err)
      setError('Error al obtener categorías')
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Cargar categorías al montar el componente
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return {
    categories,
    loading,
    error,
    fetchCategories
  }
}
