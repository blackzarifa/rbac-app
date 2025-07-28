'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { userService } from '@/services/user.service';
import { User } from '@/store/auth.store';
import { UserInput, userSchema } from '@/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Pencil, Trash2, Shield, Loader2, AlertCircle } from 'lucide-react';
import { roleColors } from '@/lib/design-system';

interface Role {
  id: number;
  name: string;
  permissions: Record<string, string[]>;
}

const roles: Role[] = [
  {
    id: 1,
    name: 'admin',
    permissions: {
      users: ['create', 'read', 'update', 'delete'],
      projects: ['create', 'read', 'update', 'delete'],
      tasks: ['create', 'read', 'update', 'delete'],
    },
  },
  {
    id: 2,
    name: 'editor',
    permissions: {
      projects: ['create', 'read', 'update'],
      tasks: ['create', 'read', 'update', 'delete'],
    },
  },
  { id: 3, name: 'viewer', permissions: { projects: ['read'], tasks: ['read'] } },
];

export default function UsersPage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<UserInput>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: '',
      password: '',
      roleId: 3,
    },
  });

  useEffect(() => {
    if (currentUser?.role.name !== 'admin') {
      router.push('/dashboard');
      toast.error('Acesso negado');
      return;
    }
    loadUsers();
  }, [currentUser, router]);

  const loadUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (data: UserInput) => {
    setSubmitting(true);
    try {
      const newUser = await userService.create(data);
      setUsers([...users, newUser]);
      setIsDialogOpen(false);
      form.reset();
      toast.success('Usuário criado com sucesso!');
    } catch (error: any) {
      const message = error?.message || 'Erro ao criar usuário';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateUser = async (data: UserInput) => {
    if (!editingUser) return;
    setSubmitting(true);
    try {
      const updateData: any = { roleId: data.roleId };
      if (data.email !== editingUser.email) {
        updateData.email = data.email;
      }
      if (data.password) {
        updateData.password = data.password;
      }

      const updated = await userService.update(editingUser.id, updateData);
      setUsers(users.map(u => (u.id === updated.id ? updated : u)));
      setIsDialogOpen(false);
      setEditingUser(null);
      form.reset();
      toast.success('Usuário atualizado com sucesso!');
    } catch (error: any) {
      const message = error?.message || 'Erro ao atualizar usuário';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    if (userToDelete.id === currentUser?.id) {
      toast.error('Você não pode excluir seu próprio usuário');
      setIsDeleteDialogOpen(false);
      return;
    }
    try {
      await userService.delete(userToDelete.id);
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      toast.success('Usuário excluído com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir usuário');
    }
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    form.reset({
      email: user.email,
      password: '',
      roleId: user.role.id,
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const getRoleBadgeProps = (role: string) => {
    const colors = roleColors[role as keyof typeof roleColors];
    return {
      className: colors?.badge || '',
      variant: 'outline' as const,
    };
  };

  if (currentUser?.role.name !== 'admin') {
    return null;
  }

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
          <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
          <p className="text-muted-foreground mt-2">Gerencie os usuários do sistema</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      {currentUser && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Você está logado como <strong>{currentUser.email}</strong> com perfil de{' '}
            <strong>{currentUser.role.name}</strong>. Tenha cuidado ao modificar permissões.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>Todos os usuários cadastrados no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>E-mail</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Permissões</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {user.email}
                      {user.id === currentUser?.id && (
                        <Badge variant="secondary" className="text-xs">
                          Você
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge {...getRoleBadgeProps(user.role.name)}>{user.role.name}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(user.role.permissions).map(([resource, actions]) => (
                        <Badge key={resource} variant="secondary" className="text-xs">
                          {resource}: {(actions as string[]).length}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(user)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => openDeleteDialog(user)}
                        disabled={user.id === currentUser?.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
            <DialogDescription>
              {editingUser
                ? 'Atualize as informações do usuário'
                : 'Preencha as informações para criar um novo usuário'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(editingUser ? handleUpdateUser : handleCreateUser)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="usuario@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Senha {editingUser && '(deixe em branco para manter a atual)'}
                    </FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perfil</FormLabel>
                    <Select
                      onValueChange={value => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um perfil" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map(role => (
                          <SelectItem key={role.id} value={role.id.toString()}>
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              <span className="capitalize">{role.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingUser(null);
                    form.reset();
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
                  ) : editingUser ? (
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o usuário "{userToDelete?.email}"? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
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
