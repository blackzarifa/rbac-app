'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { projectService, Project } from '@/services/project.service';
import { taskService } from '@/services/task.service';
import { userService } from '@/services/user.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FolderOpen, CheckSquare, Users, TrendingUp } from 'lucide-react';
import { roleColors } from '@/lib/design-system';

interface DashboardStats {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  totalUsers: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    totalUsers: 0,
  });
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      const [projects, tasks] = await Promise.all([projectService.getAll(), taskService.getAll()]);

      const completedTasks = tasks.filter(task => task.completed).length;

      setStats({
        totalProjects: projects.length,
        totalTasks: tasks.length,
        completedTasks,
        totalUsers: 0,
      });

      setRecentProjects(projects.slice(0, 5));

      if (user?.role.name === 'admin') {
        const users = await userService.getAll();
        setStats(prev => ({ ...prev, totalUsers: users.length }));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.role.name]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const getRoleBadgeProps = (role: string) => {
    const colors = roleColors[role as keyof typeof roleColors];
    return {
      className: colors?.badge || '',
      variant: 'outline' as const,
    };
  };

  const taskCompletionRate =
    stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Bem-vindo ao Sistema RBAC</p>
      </div>

      {/* User Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Usuário</CardTitle>
          <CardDescription>Suas permissões e perfil de acesso</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">E-mail</span>
              <span className="text-sm text-muted-foreground">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Perfil</span>
              <Badge {...getRoleBadgeProps(user?.role.name || '')}>{user?.role.name}</Badge>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium">Permissões</span>
              <div className="flex flex-wrap gap-2">
                {user?.role.permissions &&
                  Object.entries(user.role.permissions).map(([resource, actions]) => (
                    <div key={resource} className="text-xs">
                      <span className="font-medium">{resource}:</span>{' '}
                      <span className="text-muted-foreground">
                        {(actions as string[]).join(', ')}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Projetos</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.totalTasks}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{taskCompletionRate}%</div>
            )}
          </CardContent>
        </Card>

        {user?.role.name === 'admin' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Projetos Recentes</CardTitle>
          <CardDescription>Últimos projetos criados no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : recentProjects.length > 0 ? (
            <div className="space-y-4">
              {recentProjects.map(project => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{project.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {project.description || 'Sem descrição'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{project.tasks.length} tarefas</span>
                    <span>por {project.createdBy.email}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum projeto encontrado
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
