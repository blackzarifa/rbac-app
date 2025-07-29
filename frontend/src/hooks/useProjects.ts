'use client';

import { useState, useEffect } from 'react';
import { projectService, Project } from '@/services/project.service';
import { ProjectInput } from '@/schemas';
import { toast } from 'sonner';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    try {
      const data = await projectService.getAll();
      setProjects(data);
      return data;
    } catch (error) {
      toast.error('Erro ao carregar projetos');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (data: ProjectInput): Promise<Project> => {
    try {
      const newProject = await projectService.create(data);
      setProjects(prev => [...prev, newProject]);
      toast.success('Projeto criado com sucesso!');
      return newProject;
    } catch (error) {
      toast.error('Erro ao criar projeto');
      throw error;
    }
  };

  const updateProject = async (id: number, data: ProjectInput): Promise<Project> => {
    try {
      const updated = await projectService.update(id, data);
      setProjects(prev => prev.map(p => p.id === id ? updated : p));
      toast.success('Projeto atualizado com sucesso!');
      return updated;
    } catch (error) {
      toast.error('Erro ao atualizar projeto');
      throw error;
    }
  };

  const deleteProject = async (id: number): Promise<void> => {
    try {
      await projectService.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      toast.success('Projeto excluído com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir projeto');
      throw error;
    }
  };

  const updateProjectInState = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
    updateProjectInState,
    refreshProjects: loadProjects
  };
}