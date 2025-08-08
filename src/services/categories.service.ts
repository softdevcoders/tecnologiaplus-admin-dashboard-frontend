import httpClient from '@/libs/http'

import type { Article } from './articles.service'

export interface Category {
  id: string
  label: string
  slug: string
  description?: string
  articles: Article[]
}

export interface CategoriesResponse {
  data: Category[]
  success: boolean
  message?: string
}

class CategoriesService {
  private baseUrl = '/categories'

  async getCategories(): Promise<CategoriesResponse> {
    return httpClient.get<Category[]>(this.baseUrl)
  }
}

export default new CategoriesService()
