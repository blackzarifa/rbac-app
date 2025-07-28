import api from '@/lib/api'
import { UserInput } from '@/schemas'
import { User } from '@/store/auth.store'

export const userService = {
  async getAll(): Promise<User[]> {
    return api.get<User[]>('/users')
  },

  async getById(id: number): Promise<User> {
    return api.get<User>(`/users/${id}`)
  },

  async create(data: UserInput): Promise<User> {
    return api.post<User>('/users', data)
  },

  async update(id: number, data: Partial<UserInput>): Promise<User> {
    return api.patch<User>(`/users/${id}`, data)
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/users/${id}`)
  },
}
