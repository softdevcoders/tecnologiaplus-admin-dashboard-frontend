import { HttpClient } from '@/libs/http'
import { API_CONFIG } from '@/configs/api.config'

// Tipos para las categorías
export interface Category {
  id: string
  label: string
  slug: string
  description?: string
  color?: string
  createdAt: string
  updatedAt: string
}

export interface CategoriesListResponse {
  data: Category[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// Filtros para categorías (si es necesario en el futuro)
export interface CategoriesFilters {
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export class CategoriesService {
  private http: HttpClient

  constructor() {
    this.http = new HttpClient(API_CONFIG.baseURL)
  }

  /**
   * Obtiene la lista de categorías
   */
  async getCategories(filters?: CategoriesFilters): Promise<CategoriesListResponse> {
    const params = new URLSearchParams()

    if (filters?.search) {
      params.append('search', filters.search)
    }

    if (filters?.sortBy) {
      params.append('sort_by', filters.sortBy)
    }

    if (filters?.sortOrder) {
      params.append('sort_order', filters.sortOrder)
    }

    const queryString = params.toString()
    const url = queryString ? `/categories?${queryString}` : '/categories'

    return this.http.get<CategoriesListResponse>(url)
  }

  /**
   * Obtiene una categoría por ID
   */
  async getCategoryById(id: string): Promise<Category> {
    return this.http.get<Category>(`/categories/${id}`)
  }

  /**
   * Crea una nueva categoría
   */
  async createCategory(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    return this.http.post<Category>('/categories', categoryData)
  }

  /**
   * Actualiza una categoría existente
   */
  async updateCategory(
    id: string,
    categoryData: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Category> {
    return this.http.put<Category>(`/categories/${id}`, categoryData)
  }

  /**
   * Elimina una categoría
   */
  async deleteCategory(id: string): Promise<void> {
    return this.http.delete(`/categories/${id}`)
  }
}

// Instancia singleton del servicio
export const categoriesService = new CategoriesService()
