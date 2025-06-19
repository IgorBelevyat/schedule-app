const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const class11A = await prisma.schoolClass.upsert({
    where: { name: '11А' },
    update: {},
    create: {
      grade: 11,
      name: '11А',
    },
  });

  await prisma.schedule.createMany({
    data: [
      {
        week: 1,
        day: 1,
        lessonNum: 2,
        subject: 'Історія',
        room: '3-212',
        classId: class11A.id,
      },
      {
        week: 1,
        day: 1,
        lessonNum: 4,
        subject: 'Зар. літ.',
        room: '3-314',
        classId: class11A.id,
      },
      {
        week: 1,
        day: 1,
        lessonNum: 5,
        subject: 'Англ. мова',
        room: '2-203',
        groupCount: 3,
        groups: ['2-203', '1-411', '1-116'],
        classId: class11A.id,
      },
    ],
  });

  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: '12345', // незахищений пароль для демонстрації
    },
  });

  console.log('🌱 Seed completed');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
