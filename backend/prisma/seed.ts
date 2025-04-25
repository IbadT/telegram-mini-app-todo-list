import { PrismaClient, Priority } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create default user
  const defaultUser = await prisma.user.upsert({
    where: { telegramId: 1 },
    update: {},
    create: {
      telegramId: 1,
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

  const createdCategories: { id: number }[] = [];
  for (const category of defaultCategories) {
    const createdCategory = await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
    createdCategories.push(createdCategory);
  }

  console.log('Default categories have been seeded');

  // Create test tasks
  const defaultTasks = [
    {
      title: 'Завершить проект',
      description: 'Доделать все задачи по текущему проекту',
      priority: Priority.HIGH,
      categoryId: createdCategories[0].id, // Работа
      projectId: defaultProject.id,
    },
    {
      title: 'Подготовиться к экзамену',
      description: 'Повторить материалы за последний месяц',
      priority: Priority.MEDIUM,
      categoryId: createdCategories[1].id, // Учеба
      projectId: defaultProject.id,
    },
    {
      title: 'Сходить в магазин',
      description: 'Купить продукты на неделю',
      priority: Priority.LOW,
      categoryId: createdCategories[2].id, // Личное
      projectId: defaultProject.id,
    },
    {
      title: 'Пойти в спортзал',
      description: 'Тренировка по программе',
      priority: Priority.MEDIUM,
      categoryId: createdCategories[3].id, // Здоровье
      projectId: defaultProject.id,
    },
    {
      title: 'Убраться в квартире',
      description: 'Генеральная уборка',
      priority: Priority.LOW,
      categoryId: createdCategories[4].id, // Дом
      projectId: defaultProject.id,
    },
  ];

  for (const task of defaultTasks) {
    await prisma.task.create({
      data: task,
    });
  }

  console.log('Default tasks have been seeded');

  // Create test user if not exists
  const testUser = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      telegramId: 123456789,
      firstName: 'Test',
      lastName: 'User',
      username: 'testuser',
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