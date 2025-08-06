import httpClient, { ApiResponse } from '@/libs/http'

// Tipos para los artículos
export interface Article {
  id: string
  title: string
  content: string
  slug: string
  summary: string
  metaKeywords: string
  metaDescription: string
  coverImage: string
  images: string[] | null
  isPublished: boolean
  isPublishedInProduction: boolean
  deletedAt: string | null
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
    email: string
    role: string
    createdAt: string
    updatedAt: string
  }
  category: {
    id: string
    label: string
    slug: string
    description: string | null
    category_key: string
  }
  tags: string[]
}

export interface CreateArticleRequest {
  title: string
  content: string
  slug?: string
  summary?: string
  metaKeywords?: string
  metaDescription?: string
  coverImage?: string
  categoryId?: string
  tags?: string[]
}

export interface UpdateArticleRequest extends Partial<CreateArticleRequest> {
  id: string
}

export interface ArticlesListResponse {
  data: Article[]
  meta: {
    page: number
    limit: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export interface ArticlesFilters {
  page?: number
  limit?: number
  isPublished?: boolean
  categoryId?: string
  search?: string
  sortBy?: 'createdAt' | 'updatedAt' | 'title'
  sortOrder?: 'asc' | 'desc'
}

class ArticlesService {
  private baseUrl = '/articles'

  /**
   * Obtener lista de artículos con filtros opcionales
   */
  async getArticles(filters: ArticlesFilters = {}): Promise<ApiResponse<ArticlesListResponse>> {
    const params = new URLSearchParams()
    
    // Agregar filtros a los parámetros de la URL
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        // Convertir camelCase a snake_case para la API
        const apiKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
        params.append(apiKey, value.toString())
      }
    })

    const url = `${this.baseUrl}?${params.toString()}`
    return httpClient.get<ArticlesListResponse>(url)
  }

  /**
   * Obtener un artículo por ID
   */
  async getArticleById(id: string): Promise<ApiResponse<Article>> {
    return httpClient.get<Article>(`${this.baseUrl}/${id}`)
  }

  /**
   * Obtener un artículo por slug
   */
  async getArticleBySlug(slug: string): Promise<ApiResponse<Article>> {
    return httpClient.get<Article>(`${this.baseUrl}/slug/${slug}`)
  }

  /**
   * Crear un nuevo artículo
   */
  async createArticle(articleData: CreateArticleRequest): Promise<ApiResponse<Article>> {
    return httpClient.post<Article>(this.baseUrl, articleData)
  }

  /**
   * Actualizar un artículo existente
   */
  async updateArticle(articleData: UpdateArticleRequest): Promise<ApiResponse<Article>> {
    const { id, ...data } = articleData
    return httpClient.put<Article>(`${this.baseUrl}/${id}`, data)
  }

  /**
   * Eliminar un artículo
   */
  async deleteArticle(id: string): Promise<ApiResponse<{ message: string }>> {
    return httpClient.delete<{ message: string }>(`${this.baseUrl}/${id}`)
  }

  /**
   * Publicar un artículo (cambiar status a published)
   */
  async publishArticle(id: string): Promise<ApiResponse<Article>> {
    return httpClient.patch<Article>(`${this.baseUrl}/${id}/publish`)
  }

  /**
   * Despublicar un artículo (cambiar status a draft)
   */
  async unpublishArticle(id: string): Promise<ApiResponse<Article>> {
    return httpClient.patch<Article>(`${this.baseUrl}/${id}/unpublish`)
  }

  /**
   * Archivar un artículo (cambiar status a archived)
   */
  async archiveArticle(id: string): Promise<ApiResponse<Article>> {
    return httpClient.patch<Article>(`${this.baseUrl}/${id}/archive`)
  }

  /**
   * Obtener artículos destacados
   */
  async getFeaturedArticles(limit: number = 5): Promise<ApiResponse<Article[]>> {
    return httpClient.get<Article[]>(`${this.baseUrl}/featured?limit=${limit}`)
  }

  /**
   * Obtener artículos por categoría
   */
  async getArticlesByCategory(categoryId: string, filters: Omit<ArticlesFilters, 'category_id'> = {}): Promise<ApiResponse<ArticlesListResponse>> {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString())
      }
    })

    const url = `${this.baseUrl}/category/${categoryId}?${params.toString()}`
    return httpClient.get<ArticlesListResponse>(url)
  }
}

// Instancia singleton
const articlesService = new ArticlesService()

export default articlesService
export { ArticlesService } 