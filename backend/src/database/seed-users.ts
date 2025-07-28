import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';

export async function seedUsers(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const roleRepository = dataSource.getRepository(Role);

  const adminRole = await roleRepository.findOne({ where: { name: 'admin' } });
  const editorRole = await roleRepository.findOne({ where: { name: 'editor' } });
  const viewerRole = await roleRepository.findOne({ where: { name: 'viewer' } });

  if (!adminRole || !editorRole || !viewerRole) {
    throw new Error('Required roles not found. Make sure roles are seeded first.');
  }

  const users = [
    {
      email: 'admin@test.com',
      password: 'admin123',
      roleId: adminRole.id,
    },
    {
      email: 'editor@test.com',
      password: 'editor123',
      roleId: editorRole.id,
    },
    {
      email: 'viewer@test.com',
      password: 'viewer123',
      roleId: viewerRole.id,
    },
  ];

  for (const userData of users) {
    const existingUser = await userRepository.findOne({
      where: { email: userData.email },
    });
    if (!existingUser) {
      await userRepository.save(userRepository.create(userData));
    }
  }
}
