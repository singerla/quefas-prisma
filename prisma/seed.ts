import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.element.deleteMany();

  console.log('Seeding...');

  const password = await prisma.aspect.create({
    data: {
      name: 'password',
    },
  });

  const user = await prisma.category.create({
    data: {
      name: 'User',
      aspects: {
        connect: password,
      },
    },
  });

  const user1 = await prisma.element.create({
    data: {
      name: 'lisa@simpson.com',
      categoryId: user.id,
      attributes: {
        create: {
          aspectId: password.id,
          name: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // secret42,
        },
      },
    },
  });

  console.log({ user1 });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
