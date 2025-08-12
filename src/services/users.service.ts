import http from '@/libs/http';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'EDITOR';
  status: 'ACTIVE' | 'DEACTIVATED';
  createdAt: string;
  updatedAt: string;
  articles?: Array<{
    id: string;
    title: string;
    slug: string;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'EDITOR';
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  role?: 'ADMIN' | 'EDITOR';
}

export interface UsersResponse {
  data: User[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface UsersFilters {
  page?: number;
  limit?: number;
  role?: 'ADMIN' | 'EDITOR';
  status?: 'ACTIVE' | 'DEACTIVATED';
  search?: string;
}

class UsersService {
  async findAll(filters: UsersFilters = {}): Promise<UsersResponse> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.role) params.append('role', filters.role);
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);

    const response = await http.get(`/users?${params.toString()}`);
    return response.data;
  }

  async findOne(id: string): Promise<User> {
    const response = await http.get(`/users/${id}`);
    return response.data;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const response = await http.post('/users', createUserDto);
    return response.data;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const response = await http.put(`/users/${id}`, updateUserDto);
    return response.data;
  }

  async updateStatus(id: string, status: 'ACTIVE' | 'DEACTIVATED'): Promise<User> {
    const response = await http.patch(`/users/${id}/status`, { status });
    return response.data;
  }

  async remove(id: string): Promise<void> {
    await http.delete(`/users/${id}`);
  }
}

export const usersService = new UsersService();
