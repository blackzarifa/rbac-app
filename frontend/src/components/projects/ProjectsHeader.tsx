'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface ProjectsHeaderProps {
  onCreateProject: () => void;
}

export function ProjectsHeader({ onCreateProject }: ProjectsHeaderProps) {
  const { user } = useAuth();
  const canCreate = user?.role.permissions.projects?.includes('create');

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
        <p className="text-muted-foreground mt-2">Gerencie seus projetos e tarefas</p>
      </div>
      {canCreate && (
        <Button onClick={onCreateProject}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
      )}
    </div>
  );
}