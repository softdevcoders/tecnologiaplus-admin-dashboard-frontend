'use client'

import { useState, useEffect, useCallback } from 'react'

import { useSession } from 'next-auth/react'

import articlesService from '@/services/articles.service'
import type { ApiError } from '@/libs/http'

interface DashboardStats {
  totalArticles: number
  publishedArticles: number
  draftArticles: number
  totalCategories: number
  totalUsers: number
  loading: boolean
  error: ApiError | null
}

export const useDashboardStats = (): DashboardStats => {
  const { status } = useSession()
  const [stats, setStats] = useState<DashboardStats>({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalCategories: 10,
    totalUsers: 0, // Por defecto 1 usuario (el actual)
    loading: false,
    error: null
  })

  const fetchStats = useCallback(async () => {
    if (status === 'loading') return

    setStats(prev => ({ ...prev, loading: true, error: null }))

    try {
      // Obtener estadísticas de artículos
      const articlesResponse = await articlesService.getArticles({
        page: 1,
        limit: 1000 // Obtener todos para contar
      })

      if (articlesResponse.success) {
        const articles = articlesResponse.data.data
        const publishedArticles = articles.filter(article => article.isPublished).length
        const draftArticles = articles.filter(article => !article.isPublished).length

        setStats(prev => ({
          ...prev,
          totalArticles: articles.length,
          publishedArticles,
          draftArticles,
          totalCategories: 10,
          loading: false
        }))
      } else {
        throw new Error(articlesResponse.message || 'Error al obtener estadísticas de artículos')
      }
    } catch (error) {
      const apiError = error as ApiError

      setStats(prev => ({
        ...prev,
        loading: false,
        error: apiError
      }))
    }
  }, [status])

  // Cargar estadísticas cuando la sesión esté lista
  useEffect(() => {
    if (status === 'authenticated') {
      fetchStats()
    }
  }, [status, fetchStats])

  return stats
}
