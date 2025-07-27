import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

export const userSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  roleId: z.number().int().positive('Perfil inválido'),
})

export const projectSchema = z.object({
  name: z.string().min(1, 'Nome do projeto é obrigatório').max(255),
  description: z.string().optional(),
})

export const taskSchema = z.object({
  title: z.string().min(1, 'Título da tarefa é obrigatório').max(255),
  completed: z.boolean().default(false),
  projectId: z.number().int().positive('Projeto inválido'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type UserInput = z.infer<typeof userSchema>
export type ProjectInput = z.infer<typeof projectSchema>
export type TaskInput = z.infer<typeof taskSchema>
