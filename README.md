# Sistema RBAC - Gerenciamento de Usuários, Projetos e Tarefas

Sistema de gerenciamento com controle de acesso baseado em funções (RBAC), desenvolvido com NestJS, Next.js e PostgreSQL.

## 🚀 Execução

### Pré-requisitos

- Docker e Docker Compose
- Git

### Iniciar o Sistema

```bash
git clone <repository-url>
cd rbac-app
docker-compose up
```

Aguarde a inicialização completa (pode levar alguns minutos na primeira execução).

**Acesso:**

- Frontend: http://localhost:3001
- Backend API: http://localhost:3000

### Credenciais de Teste

O sistema é inicializado com três usuários:

- **Admin**: `admin@test.com` / `admin123`
- **Editor**: `editor@test.com` / `editor123`
- **Viewer**: `viewer@test.com` / `viewer123`

## 🔐 Controle de Acesso

### Permissões por Função

| Função     | Usuários                  | Projetos                  | Tarefas                   |
| ---------- | ------------------------- | ------------------------- | ------------------------- |
| **Admin**  | ✅ Criar, editar, excluir | ✅ Criar, editar, excluir | ✅ Criar, editar, excluir |
| **Editor** | ❌ Sem acesso             | ✅ Criar, editar          | ✅ Criar, editar, excluir |
| **Viewer** | ❌ Sem acesso             | ✅ Apenas visualizar      | ✅ Apenas visualizar      |

## 🏗️ Tecnologias

**Backend:**

- NestJS com TypeScript
- PostgreSQL + TypeORM
- JWT para autenticação
- bcrypt para senhas
- class-validator para validação

**Frontend:**

- Next.js 15 com TypeScript
- TailwindCSS + shadcn/ui
- Zustand para estado global
- Zod para validação de formulários
- React Hook Form
