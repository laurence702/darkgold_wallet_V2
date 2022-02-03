import { PrismaClient } from '.prisma/client';

const prisma = new PrismaClient();

const main = async () => {
  await prisma.user.create({
    data: {
      firstName: 'Francis',
      lastName: 'Laurence',
      email: 'akaigbokwelaurence@gmail.com',
      isVerified: 1,
      password: '$2a$10$EfDC5.ZRP/BShJySkRSNBu/u66HtMshuRHU6euT8cHWBo.QJC3E0y',
    },
  });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
