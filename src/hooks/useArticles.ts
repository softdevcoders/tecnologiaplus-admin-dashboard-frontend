import { useState, useEffect } from 'react'

import { useSession } from 'next-auth/react'

import type {
  Article,
  ArticlesFilters,
  CreateArticleRequest,
  UpdateArticleRequest
} from '@/services/articles.service';
import articlesService from '@/services/articles.service'
import type { ApiError } from '@/libs/http'

interface UseArticlesState {
  articles: Article[]
  total: number
  page: number
  limit: number
  totalPages: number
  loading: boolean
  error: ApiError | null
}

interface UseArticlesReturn extends UseArticlesState {
  fetchArticles: (filters?: ArticlesFilters) => Promise<void>
  getArticleById: (id: string) => Promise<Article | null>
  createArticle: (articleData: CreateArticleRequest) => Promise<Article | null>
  updateArticle: (articleData: UpdateArticleRequest) => Promise<Article | null>
  deleteArticle: (id: string) => Promise<boolean>
  publishArticle: (id: string) => Promise<Article | null>
  unpublishArticle: (id: string) => Promise<Article | null>
  archiveArticle: (id: string) => Promise<Article | null>
  clearError: () => void
}

export const useArticles = (initialFilters: ArticlesFilters = {}): UseArticlesReturn => {
  const { status } = useSession()

  const [state, setState] = useState<UseArticlesState>({
    articles: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    loading: false,
    error: null
  })

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }))
  }

  const fetchArticles = async (filters: ArticlesFilters = {}) => {
    if (status === 'loading') return

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await articlesService.getArticles({
        page: state.page,
        limit: state.limit,
        ...initialFilters,
        ...filters
      })

      if (response.success) {
        setState(prev => ({
          ...prev,
          articles: response.data.data,
          total: response.data.meta.totalItems,
          page: response.data.meta.page,
          limit: response.data.meta.limit,
          totalPages: response.data.meta.totalPages,
          loading: false
        }))
      } else {
        throw new Error(response.message || 'Error al obtener artículos')
      }
    } catch (error) {
      const apiError = error as ApiError

      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError
      }))
    }
  }

  const getArticleById = async (id: string): Promise<Article | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await articlesService.getArticleById(id)

      if (response.success) {
        setState(prev => ({ ...prev, loading: false }))
        
return response.data
      } else {
        throw new Error(response.message || 'Error al obtener artículo')
      }
    } catch (error) {
      const apiError = error as ApiError

      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError
      }))
      
return null
    }
  }

  const createArticle = async (articleData: CreateArticleRequest): Promise<Article | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await articlesService.createArticle(articleData)

      if (response.success) {
        // Recargar la lista de artículos
        await fetchArticles()
        
return response.data
      } else {
        throw new Error(response.message || 'Error al crear artículo')
      }
    } catch (error) {
      const apiError = error as ApiError

      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError
      }))
      
return null
    }
  }

  const updateArticle = async (articleData: UpdateArticleRequest): Promise<Article | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await articlesService.updateArticle(articleData)

      if (response.success) {
        // Actualizar el artículo en la lista
        setState(prev => ({
          ...prev,
          articles: prev.articles.map(article => (article.id === articleData.id ? response.data : article)),
          loading: false
        }))
        
return response.data
      } else {
        throw new Error(response.message || 'Error al actualizar artículo')
      }
    } catch (error) {
      const apiError = error as ApiError

      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError
      }))
      
return null
    }
  }

  const deleteArticle = async (id: string): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await articlesService.deleteArticle(id)

      if (response.success) {
        // Remover el artículo de la lista
        setState(prev => ({
          ...prev,
          articles: prev.articles.filter(article => article.id !== id),
          total: prev.total - 1,
          loading: false
        }))
        
return true
      } else {
        throw new Error(response.message || 'Error al eliminar artículo')
      }
    } catch (error) {
      const apiError = error as ApiError

      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError
      }))
      
return false
    }
  }

  const publishArticle = async (id: string): Promise<Article | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await articlesService.publishArticle(id)

      if (response.success) {
        // Actualizar el artículo en la lista
        setState(prev => ({
          ...prev,
          articles: prev.articles.map(article => (article.id === id ? response.data : article)),
          loading: false
        }))
        
return response.data
      } else {
        throw new Error(response.message || 'Error al publicar artículo')
      }
    } catch (error) {
      const apiError = error as ApiError

      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError
      }))
      
return null
    }
  }

  const unpublishArticle = async (id: string): Promise<Article | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await articlesService.unpublishArticle(id)

      if (response.success) {
        // Actualizar el artículo en la lista
        setState(prev => ({
          ...prev,
          articles: prev.articles.map(article => (article.id === id ? response.data : article)),
          loading: false
        }))
        
return response.data
      } else {
        throw new Error(response.message || 'Error al despublicar artículo')
      }
    } catch (error) {
      const apiError = error as ApiError

      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError
      }))
      
return null
    }
  }

  const archiveArticle = async (id: string): Promise<Article | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await articlesService.archiveArticle(id)

      if (response.success) {
        // Actualizar el artículo en la lista
        setState(prev => ({
          ...prev,
          articles: prev.articles.map(article => (article.id === id ? response.data : article)),
          loading: false
        }))
        
return response.data
      } else {
        throw new Error(response.message || 'Error al archivar artículo')
      }
    } catch (error) {
      const apiError = error as ApiError

      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError
      }))
      
return null
    }
  }

  // Cargar artículos cuando la sesión esté lista
  useEffect(() => {
    if (status === 'authenticated') {
      fetchArticles()
    }
  }, [status])

  return {
    ...state,
    fetchArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    publishArticle,
    unpublishArticle,
    archiveArticle,
    clearError
  }
}
