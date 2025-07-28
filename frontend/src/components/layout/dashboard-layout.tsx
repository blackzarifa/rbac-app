'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { 
  FolderOpen, 
  Users, 
  LogOut, 
  LayoutDashboard,
  Shield,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { roleColors } from '@/lib/design-system'
import { toast } from 'sonner'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    toast.success('Logout realizado com sucesso')
    router.push('/login')
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projetos', href: '/dashboard/projects', icon: FolderOpen },
  ]

  if (user?.role.name === 'admin') {
    navigation.push({ name: 'Usuários', href: '/dashboard/users', icon: Users })
  }

  const getRoleBadgeProps = (role: string) => {
    const colors = roleColors[role as keyof typeof roleColors]
    return {
      className: colors?.badge || '',
      variant: 'outline' as const,
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h2 className="text-lg font-semibold">Sistema RBAC</h2>
          </div>
          
          <nav className="flex-1 px-4 pb-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-md mb-1
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                      : 'hover:bg-sidebar-accent/50 text-muted-foreground hover:text-sidebar-accent-foreground'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.name}</span>
                  {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                </Link>
              )
            })}
          </nav>

          <Separator className="mx-4" />

          <div className="p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 h-auto p-3"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium truncate">
                        {user?.email}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge {...getRoleBadgeProps(user?.role.name || '')}>
                          {user?.role.name}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span className="text-xs text-muted-foreground">
                    Perfil: {user?.role.name}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
