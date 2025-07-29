'use client';

import { Project } from '@/services/project.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderOpen, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface ProjectListItemProps {
  project: Project;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProjectListItem({ 
  project, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete 
}: ProjectListItemProps) {
  const { user } = useAuth();
  const canUpdate = user?.role.permissions.projects?.includes('update');
  const canDelete = user?.role.permissions.projects?.includes('delete');

  return (
    <div
      className={`p-4 cursor-pointer transition-colors hover:bg-accent ${
        isSelected ? 'bg-accent' : ''
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1 flex-1">
          <p className="text-sm font-medium leading-none">{project.name}</p>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description || 'Sem descrição'}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FolderOpen className="h-3 w-3" />
            <span>{project.tasks.length} tarefas</span>
          </div>
        </div>
        {(canUpdate || canDelete) && (
          <div className="flex gap-1">
            {canUpdate && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {canDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface ProjectListProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (project: Project) => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (project: Project) => void;
}

export function ProjectList({ 
  projects, 
  selectedProject, 
  onSelectProject, 
  onEditProject, 
  onDeleteProject 
}: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lista de Projetos</CardTitle>
          <CardDescription>Selecione um projeto para ver suas tarefas</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhum projeto encontrado
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Projetos</CardTitle>
        <CardDescription>Selecione um projeto para ver suas tarefas</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {projects.map(project => (
            <ProjectListItem
              key={project.id}
              project={project}
              isSelected={selectedProject?.id === project.id}
              onSelect={() => onSelectProject(project)}
              onEdit={() => onEditProject(project)}
              onDelete={() => onDeleteProject(project)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}