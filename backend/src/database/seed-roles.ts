import { DataSource } from 'typeorm';
import { Role } from '../entities/role.entity';

export async function seedRoles(dataSource: DataSource) {
  const roleRepository = dataSource.getRepository(Role);

  const roles = [
    {
      name: 'admin',
      permissions: {
        users: ['create', 'read', 'update', 'delete'],
        projects: ['create', 'read', 'update', 'delete'],
        tasks: ['create', 'read', 'update', 'delete'],
      },
    },
    {
      name: 'editor',
      permissions: {
        projects: ['create', 'read', 'update'],
        tasks: ['create', 'read', 'update', 'delete'],
      },
    },
    {
      name: 'viewer',
      permissions: {
        projects: ['read'],
        tasks: ['read'],
      },
    },
  ];

  for (const roleData of roles) {
    const existingRole = await roleRepository.findOne({
      where: { name: roleData.name },
    });
    if (!existingRole) {
      await roleRepository.save(roleRepository.create(roleData));
    }
  }
}
