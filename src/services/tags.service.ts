import type { ApiResponse } from '@/libs/http';
import httpClient from '@/libs/http'

export interface Tag {
  id: string
  name: string
  slug: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface CreateTagRequest {
  name: string
  slug?: string
  description?: string
}

export interface TagsListResponse {
  data: Tag[]
  meta: {
    page: number
    limit: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

class TagsService {
  private baseUrl = '/tags'

  /**
   * Obtener lista de tags
   */
  async getTags(): Promise<ApiResponse<TagsListResponse>> {
    return httpClient.get<TagsListResponse>(this.baseUrl)
  }

  /**
   * Crear un nuevo tag
   */
  async createTag(tagData: CreateTagRequest): Promise<ApiResponse<Tag>> {
    return httpClient.post<Tag>(this.baseUrl, tagData)
  }

  /**
   * Obtener tag por ID
   */
  async getTagById(id: string): Promise<ApiResponse<Tag>> {
    return httpClient.get<Tag>(`${this.baseUrl}/${id}`)
  }

  /**
   * Actualizar tag
   */
  async updateTag(id: string, tagData: Partial<CreateTagRequest>): Promise<ApiResponse<Tag>> {
    return httpClient.put<Tag>(`${this.baseUrl}/${id}`, tagData)
  }

  /**
   * Eliminar tag
   */
  async deleteTag(id: string): Promise<ApiResponse<{ message: string }>> {
    return httpClient.delete<{ message: string }>(`${this.baseUrl}/${id}`)
  }
}

export const tagsService = new TagsService()
