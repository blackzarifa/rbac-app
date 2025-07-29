'use client';

import { taskService, Task } from '@/services/task.service';
import { TaskInput } from '@/schemas';
import { toast } from 'sonner';

export function useTasks() {
  const createTask = async (data: TaskInput): Promise<Task> => {
    try {
      const newTask = await taskService.create(data);
      toast.success('Tarefa criada com sucesso!');
      return newTask;
    } catch (error) {
      toast.error('Erro ao criar tarefa');
      throw error;
    }
  };

  const updateTask = async (id: number, data: Partial<TaskInput>): Promise<Task> => {
    try {
      const updated = await taskService.update(id, data);
      const message = data.completed !== undefined 
        ? (data.completed ? 'Tarefa concluída!' : 'Tarefa reaberta!')
        : 'Tarefa atualizada com sucesso!';
      toast.success(message);
      return updated;
    } catch (error) {
      toast.error('Erro ao atualizar tarefa');
      throw error;
    }
  };

  const deleteTask = async (id: number): Promise<void> => {
    try {
      await taskService.delete(id);
      toast.success('Tarefa excluída com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir tarefa');
      throw error;
    }
  };

  return {
    createTask,
    updateTask,
    deleteTask
  };
}