import api from '@/lib/api'
import { TaskInput } from '@/schemas'

export interface Task {
  id: number
  title: string
  completed: boolean
  projectId: number
  project?: {
    id: number
    name: string
  }
  createdAt: string
  updatedAt: string
}

export const taskService = {
  async getAll(projectId?: number): Promise<Task[]> {
    const params = projectId ? { projectId: projectId.toString() } : undefined
    return api.get<Task[]>('/tasks', params)
  },

  async getById(id: number): Promise<Task> {
    return api.get<Task>(`/tasks/${id}`)
  },

  async create(data: TaskInput): Promise<Task> {
    return api.post<Task>('/tasks', data)
  },

  async update(id: number, data: Partial<TaskInput>): Promise<Task> {
    return api.patch<Task>(`/tasks/${id}`, data)
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`)
  },
}
