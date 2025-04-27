import { PrismaClient } from '@prisma/client';

enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

const prisma = new PrismaClient();

async function main() {
  // Create default user
  const defaultUser = await prisma.user.upsert({
    where: { telegramId: '1' },
    update: {},
    create: {
      telegramId: '1',
      firstName: 'Default',
      lastName: 'User',
      username: 'default_user',
    },
  });

  console.log('Default user created:', defaultUser);

  const defaultProject = await prisma.project.create({
    data: {
      name: 'Default Project',
      ownerId: defaultUser.id,
    },
  });

  console.log('Default project created:', defaultProject);

  const defaultCategories = [
    {
      name: 'Работа',
      color: '#FF6B6B',
    },
    {
      name: 'Учеба',
      color: '#4ECDC4',
    },
    {
      name: 'Личное',
      color: '#45B7D1',
    },
    {
      name: 'Здоровье',
      color: '#96CEB4',
    },
    {
      name: 'Дом',
      color: '#FFEEAD',
    },
  ];

  const createdCategories = await Promise.all(
    defaultCategories.map(category =>
      prisma.category.create({
        data: {
          ...category,
          project: {
            connect: {
              id: defaultProject.id,
            },
          },
        },
      })
    )
  );

  console.log('Default categories have been seeded');

  // Create test tasks with proper typing
  const defaultTasks = [
    {
      title: 'Завершить проект',
      description: 'Доделать все задачи по текущему проекту',
      priority: Priority.HIGH,
      category: { connect: { id: createdCategories[0].id } },
      project: { connect: { id: defaultProject.id } },
    },
    {
      title: 'Подготовиться к экзамену',
      description: 'Повторить материалы за последний месяц',
      priority: Priority.MEDIUM,
      category: { connect: { id: createdCategories[1].id } },
      project: { connect: { id: defaultProject.id } },
    },
    {
      title: 'Сходить в магазин',
      description: 'Купить продукты на неделю',
      priority: Priority.LOW,
      category: { connect: { id: createdCategories[2].id } },
      project: { connect: { id: defaultProject.id } },
    },
    {
      title: 'Пойти в спортзал',
      description: 'Тренировка по программе',
      priority: Priority.MEDIUM,
      category: { connect: { id: createdCategories[3].id } },
      project: { connect: { id: defaultProject.id } },
    },
    {
      title: 'Убраться в квартире',
      description: 'Генеральная уборка',
      priority: Priority.LOW,
      category: { connect: { id: createdCategories[4].id } },
      project: { connect: { id: defaultProject.id } },
    },
  ];

  await Promise.all(
    defaultTasks.map(task =>
      prisma.task.create({
        data: task,
      })
    )
  );

  console.log('Default tasks have been seeded');

  // Create test user if not exists
  const testUser = await prisma.user.upsert({
    where: { telegramId: '123456789' },
    update: {},
    create: {
      telegramId: '123456789',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
    },
  });

  console.log('Test user created:', testUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });