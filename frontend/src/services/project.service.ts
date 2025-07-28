import api from '@/lib/api'
import { ProjectInput } from '@/schemas'

export interface Project {
  id: number
  name: string
  description?: string
  createdById: number
  createdBy: {
    id: number
    email: string
  }
  tasks: Task[]
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: number
  title: string
  completed: boolean
  projectId: number
  createdAt: string
  updatedAt: string
}

export const projectService = {
  async getAll(): Promise<Project[]> {
    return api.get<Project[]>('/projects')
  },

  async getById(id: number): Promise<Project> {
    return api.get<Project>(`/projects/${id}`)
  },

  async create(data: ProjectInput): Promise<Project> {
    return api.post<Project>('/projects', data)
  },

  async update(id: number, data: Partial<ProjectInput>): Promise<Project> {
    return api.patch<Project>(`/projects/${id}`, data)
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/projects/${id}`)
  },
}
