import { useState, useEffect, useCallback } from 'react'
import { categoriesService, Category, CategoriesFilters } from '@/services/categories.service'

interface UseCategoriesReturn {
  categories: Category[]
  loading: boolean
  error: string | null
  fetchCategories: (filters?: CategoriesFilters) => Promise<void>
  getCategoryById: (id: string) => Promise<Category | null>
  createCategory: (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Category | null>
  updateCategory: (id: string, categoryData: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<Category | null>
  deleteCategory: (id: string) => Promise<boolean>
}

export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async (filters?: CategoriesFilters) => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('useCategories - fetchCategories called')
      const response = await categoriesService.getCategories(filters)
      console.log('useCategories - response:', response)
      console.log('useCategories - response.data:', response.data)
      setCategories(response.data)
    } catch (err) {
      console.error('Error al obtener categorías:', err)
      setError('Error al obtener categorías')
    } finally {
      setLoading(false)
    }
  }, [])

  const getCategoryById = useCallback(async (id: string): Promise<Category | null> => {
    try {
      setError(null)
      const category = await categoriesService.getCategoryById(id)
      return category
    } catch (err) {
      console.error('Error al obtener categoría:', err)
      setError('Error al obtener categoría')
      return null
    }
  }, [])

  const createCategory = useCallback(async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category | null> => {
    try {
      setError(null)
      const newCategory = await categoriesService.createCategory(categoryData)
      
      // Actualizar la lista local
      setCategories(prev => [...prev, newCategory])
      
      return newCategory
    } catch (err) {
      console.error('Error al crear categoría:', err)
      setError('Error al crear categoría')
      return null
    }
  }, [])

  const updateCategory = useCallback(async (id: string, categoryData: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Category | null> => {
    try {
      setError(null)
      const updatedCategory = await categoriesService.updateCategory(id, categoryData)
      
      // Actualizar la lista local
      setCategories(prev => prev.map(cat => cat.id === id ? updatedCategory : cat))
      
      return updatedCategory
    } catch (err) {
      console.error('Error al actualizar categoría:', err)
      setError('Error al actualizar categoría')
      return null
    }
  }, [])

  const deleteCategory = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null)
      await categoriesService.deleteCategory(id)
      
      // Actualizar la lista local
      setCategories(prev => prev.filter(cat => cat.id !== id))
      
      return true
    } catch (err) {
      console.error('Error al eliminar categoría:', err)
      setError('Error al eliminar categoría')
      return false
    }
  }, [])

  // Cargar categorías al montar el hook
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return {
    categories,
    loading,
    error,
    fetchCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
  }
} 