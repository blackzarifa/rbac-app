'use client';

import { Project } from '@/services/project.service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TaskList } from './TaskList';
import { useAuth } from '@/hooks/use-auth';

interface ProjectDetailsProps {
  project: Project | null;
  onCreateTask: () => void;
  onProjectUpdate: (project: Project) => void;
}

export function ProjectDetails({ project, onCreateTask, onProjectUpdate }: ProjectDetailsProps) {
  const { user } = useAuth();
  const canCreateTask = user?.role.permissions.tasks?.includes('create');

  if (!project) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Selecione um projeto para ver suas tarefas</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{project.name}</CardTitle>
            <CardDescription>
              {project.description || 'Sem descrição'}
            </CardDescription>
          </div>
          {canCreateTask && (
            <Button size="sm" onClick={onCreateTask}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Tarefa
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Criado por: {project.createdBy.email}</span>
            <span>•</span>
            <span>
              {project.tasks.filter(t => t.completed).length} de{' '}
              {project.tasks.length} tarefas concluídas
            </span>
          </div>

          <TaskList project={project} onProjectUpdate={onProjectUpdate} />
        </div>
      </CardContent>
    </Card>
  );
}