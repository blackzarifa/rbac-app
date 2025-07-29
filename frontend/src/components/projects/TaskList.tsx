'use client';

import { Task, Project } from '@/services/task.service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskItem } from './TaskItem';
import { useAuth } from '@/hooks/use-auth';
import { useTasks } from '@/hooks/useTasks';

interface TaskListProps {
  project: Project;
  onProjectUpdate: (project: Project) => void;
}

export function TaskList({ project, onProjectUpdate }: TaskListProps) {
  const { user } = useAuth();
  const { updateTask, deleteTask } = useTasks();
  
  const canUpdate = user?.role.permissions.tasks?.includes('update');
  const canDelete = user?.role.permissions.tasks?.includes('delete');

  const handleToggleTask = async (task: Task) => {
    if (!canUpdate) return;
    
    try {
      const updated = await updateTask(task.id, {
        completed: !task.completed,
      });
      
      const updatedProject = {
        ...project,
        tasks: project.tasks.map(t => t.id === updated.id ? updated : t),
      };
      onProjectUpdate(updatedProject);
    } catch {
      // Error handled in hook
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!canDelete) return;
    
    try {
      await deleteTask(taskId);
      const updatedProject = {
        ...project,
        tasks: project.tasks.filter(t => t.id !== taskId),
      };
      onProjectUpdate(updatedProject);
    } catch {
      // Error handled in hook
    }
  };

  const renderTasks = (tasks: Task[]) => {
    if (tasks.length === 0) {
      return (
        <p className="text-sm text-muted-foreground text-center py-8">
          Nenhuma tarefa encontrada
        </p>
      );
    }

    return (
      <div className="space-y-2">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            canUpdate={canUpdate}
            canDelete={canDelete}
            onToggle={() => handleToggleTask(task)}
            onDelete={() => handleDeleteTask(task.id)}
          />
        ))}
      </div>
    );
  };

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList>
        <TabsTrigger value="all">Todas</TabsTrigger>
        <TabsTrigger value="pending">Pendentes</TabsTrigger>
        <TabsTrigger value="completed">Concluídas</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="space-y-2">
        {renderTasks(project.tasks)}
      </TabsContent>
      
      <TabsContent value="pending" className="space-y-2">
        {renderTasks(project.tasks.filter(t => !t.completed))}
      </TabsContent>
      
      <TabsContent value="completed" className="space-y-2">
        {renderTasks(project.tasks.filter(t => t.completed))}
      </TabsContent>
    </Tabs>
  );
}