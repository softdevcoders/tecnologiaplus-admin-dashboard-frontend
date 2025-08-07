import httpClient from '@/libs/http'

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
  private http = httpClient

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

    const response = await this.http.get<CategoriesListResponse>(url)

    return response.data
  }

  /**
   * Obtiene una categoría por ID
   */
  async getCategoryById(id: string): Promise<Category> {
    const response = await this.http.get<Category>(`/categories/${id}`)

    return response.data
  }

  /**
   * Crea una nueva categoría
   */
  async createCategory(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    const response = await this.http.post<Category>('/categories', categoryData)

    return response.data
  }

  /**
   * Actualiza una categoría existente
   */
  async updateCategory(
    id: string,
    categoryData: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Category> {
    const response = await this.http.put<Category>(`/categories/${id}`, categoryData)

    return response.data
  }

  /**
   * Elimina una categoría
   */
  async deleteCategory(id: string): Promise<void> {
    const response = await this.http.delete(`/categories/${id}`)

    return response.data
  }
}

// Instancia singleton del servicio
export const categoriesService = new CategoriesService()
