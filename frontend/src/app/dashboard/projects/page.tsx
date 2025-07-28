'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { projectService, Project } from '@/services/project.service';
import { taskService, Task } from '@/services/task.service';
import { ProjectInput, projectSchema, TaskInput, taskSchema } from '@/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Pencil, Trash2, FolderOpen, CheckSquare, Square, Loader2 } from 'lucide-react';

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canCreate = user?.role.permissions.projects?.includes('create');
  const canUpdate = user?.role.permissions.projects?.includes('update');
  const canDelete = user?.role.permissions.projects?.includes('delete');
  const canCreateTask = user?.role.permissions.tasks?.includes('create');
  const canUpdateTask = user?.role.permissions.tasks?.includes('update');
  const canDeleteTask = user?.role.permissions.tasks?.includes('delete');

  const projectForm = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const taskForm = useForm<TaskInput>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      completed: false,
      projectId: 0,
    },
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectService.getAll();
      setProjects(data);
      if (data.length > 0 && !selectedProject) {
        setSelectedProject(data[0]);
      }
    } catch (error) {
      toast.error('Erro ao carregar projetos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (data: ProjectInput) => {
    setSubmitting(true);
    try {
      const newProject = await projectService.create(data);
      setProjects([...projects, newProject]);
      setIsProjectDialogOpen(false);
      projectForm.reset();
      toast.success('Projeto criado com sucesso!');
      setSelectedProject(newProject);
    } catch (error) {
      toast.error('Erro ao criar projeto');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProject = async (data: ProjectInput) => {
    if (!editingProject) return;
    setSubmitting(true);
    try {
      const updated = await projectService.update(editingProject.id, data);
      setProjects(projects.map(p => (p.id === updated.id ? updated : p)));
      if (selectedProject?.id === updated.id) {
        setSelectedProject(updated);
      }
      setIsProjectDialogOpen(false);
      setEditingProject(null);
      projectForm.reset();
      toast.success('Projeto atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar projeto');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    try {
      await projectService.delete(projectToDelete.id);
      setProjects(projects.filter(p => p.id !== projectToDelete.id));
      if (selectedProject?.id === projectToDelete.id) {
        setSelectedProject(projects[0] || null);
      }
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
      toast.success('Projeto excluído com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir projeto');
    }
  };

  const handleCreateTask = async (data: TaskInput) => {
    if (!selectedProject) return;
    setSubmitting(true);
    try {
      const newTask = await taskService.create({
        ...data,
        projectId: selectedProject.id,
      });
      const updatedProject = {
        ...selectedProject,
        tasks: [...selectedProject.tasks, newTask],
      };
      setProjects(projects.map(p => (p.id === updatedProject.id ? updatedProject : p)));
      setSelectedProject(updatedProject);
      setIsTaskDialogOpen(false);
      taskForm.reset();
      toast.success('Tarefa criada com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar tarefa');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleTask = async (task: Task) => {
    if (!canUpdateTask) return;
    try {
      const updated = await taskService.update(task.id, {
        completed: !task.completed,
      });
      if (selectedProject) {
        const updatedProject = {
          ...selectedProject,
          tasks: selectedProject.tasks.map(t => (t.id === updated.id ? updated : t)),
        };
        setProjects(projects.map(p => (p.id === updatedProject.id ? updatedProject : p)));
        setSelectedProject(updatedProject);
      }
      toast.success(updated.completed ? 'Tarefa concluída!' : 'Tarefa reaberta!');
    } catch (error) {
      toast.error('Erro ao atualizar tarefa');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!canDeleteTask || !selectedProject) return;
    try {
      await taskService.delete(taskId);
      const updatedProject = {
        ...selectedProject,
        tasks: selectedProject.tasks.filter(t => t.id !== taskId),
      };
      setProjects(projects.map(p => (p.id === updatedProject.id ? updatedProject : p)));
      setSelectedProject(updatedProject);
      toast.success('Tarefa excluída com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir tarefa');
    }
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    projectForm.reset({
      name: project.name,
      description: project.description || '',
    });
    setIsProjectDialogOpen(true);
  };

  const openDeleteDialog = (project: Project) => {
    setProjectToDelete(project);
    setIsDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
          <p className="text-muted-foreground mt-2">Gerencie seus projetos e tarefas</p>
        </div>
        {canCreate && (
          <Button onClick={() => setIsProjectDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Projeto
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Projetos</CardTitle>
              <CardDescription>Selecione um projeto para ver suas tarefas</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {projects.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nenhum projeto encontrado
                </p>
              ) : (
                <div className="divide-y">
                  {projects.map(project => (
                    <div
                      key={project.id}
                      className={`p-4 cursor-pointer transition-colors hover:bg-accent ${
                        selectedProject?.id === project.id ? 'bg-accent' : ''
                      }`}
                      onClick={() => setSelectedProject(project)}
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
                                onClick={e => {
                                  e.stopPropagation();
                                  openEditDialog(project);
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
                                onClick={e => {
                                  e.stopPropagation();
                                  openDeleteDialog(project);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedProject ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedProject.name}</CardTitle>
                    <CardDescription>
                      {selectedProject.description || 'Sem descrição'}
                    </CardDescription>
                  </div>
                  {canCreateTask && (
                    <Button
                      size="sm"
                      onClick={() => {
                        taskForm.setValue('projectId', selectedProject.id);
                        setIsTaskDialogOpen(true);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Nova Tarefa
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Criado por: {selectedProject.createdBy.email}</span>
                    <span>•</span>
                    <span>
                      {selectedProject.tasks.filter(t => t.completed).length} de{' '}
                      {selectedProject.tasks.length} tarefas concluídas
                    </span>
                  </div>

                  <Tabs defaultValue="all" className="w-full">
                    <TabsList>
                      <TabsTrigger value="all">Todas</TabsTrigger>
                      <TabsTrigger value="pending">Pendentes</TabsTrigger>
                      <TabsTrigger value="completed">Concluídas</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all" className="space-y-2">
                      {selectedProject.tasks.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          Nenhuma tarefa encontrada
                        </p>
                      ) : (
                        selectedProject.tasks.map(task => (
                          <TaskItem
                            key={task.id}
                            task={task}
                            canUpdate={canUpdateTask}
                            canDelete={canDeleteTask}
                            onToggle={() => handleToggleTask(task)}
                            onDelete={() => handleDeleteTask(task.id)}
                          />
                        ))
                      )}
                    </TabsContent>
                    <TabsContent value="pending" className="space-y-2">
                      {selectedProject.tasks
                        .filter(t => !t.completed)
                        .map(task => (
                          <TaskItem
                            key={task.id}
                            task={task}
                            canUpdate={canUpdateTask}
                            canDelete={canDeleteTask}
                            onToggle={() => handleToggleTask(task)}
                            onDelete={() => handleDeleteTask(task.id)}
                          />
                        ))}
                    </TabsContent>
                    <TabsContent value="completed" className="space-y-2">
                      {selectedProject.tasks
                        .filter(t => t.completed)
                        .map(task => (
                          <TaskItem
                            key={task.id}
                            task={task}
                            canUpdate={canUpdateTask}
                            canDelete={canDeleteTask}
                            onToggle={() => handleToggleTask(task)}
                            onDelete={() => handleDeleteTask(task.id)}
                          />
                        ))}
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <p className="text-muted-foreground">Selecione um projeto para ver suas tarefas</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Project Dialog */}
      <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Editar Projeto' : 'Novo Projeto'}</DialogTitle>
            <DialogDescription>
              {editingProject
                ? 'Atualize as informações do projeto'
                : 'Preencha as informações para criar um novo projeto'}
            </DialogDescription>
          </DialogHeader>
          <Form {...projectForm}>
            <form
              onSubmit={projectForm.handleSubmit(
                editingProject ? handleUpdateProject : handleCreateProject,
              )}
              className="space-y-4"
            >
              <FormField
                control={projectForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do projeto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={projectForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descrição do projeto (opcional)"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsProjectDialogOpen(false);
                    setEditingProject(null);
                    projectForm.reset();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : editingProject ? (
                    'Atualizar'
                  ) : (
                    'Criar'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Task Dialog */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Tarefa</DialogTitle>
            <DialogDescription>Adicione uma nova tarefa ao projeto</DialogDescription>
          </DialogHeader>
          <Form {...taskForm}>
            <form onSubmit={taskForm.handleSubmit(handleCreateTask)} className="space-y-4">
              <FormField
                control={taskForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Título da tarefa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsTaskDialogOpen(false);
                    taskForm.reset();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    'Criar'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o projeto "{projectToDelete?.name}"? Esta ação não pode
              ser desfeita e todas as tarefas serão excluídas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProjectToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface TaskItemProps {
  task: Task;
  canUpdate: boolean;
  canDelete: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

function TaskItem({ task, canUpdate, canDelete, onToggle, onDelete }: TaskItemProps) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
      <div className="flex items-center gap-3">
        <button onClick={onToggle} disabled={!canUpdate} className="focus:outline-none">
          {task.completed ? (
            <CheckSquare className="h-5 w-5 text-primary" />
          ) : (
            <Square className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
        <span className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
          {task.title}
        </span>
      </div>
      {canDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
