import api from '@/lib/api'
import { LoginInput } from '@/schemas'
import { User } from '@/store/auth.store'

interface LoginResponse {
  access_token: string
  user: User
}

export const authService = {
  async login(data: LoginInput): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', data)
    return response.data
  },

  async register(data: LoginInput & { roleId?: number }): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/register', data)
    return response.data
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>('/auth/profile')
    return response.data
  },
}
