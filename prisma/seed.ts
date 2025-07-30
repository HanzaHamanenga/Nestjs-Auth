import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await argon2.hash('password123');

  // Create or update the user if already exists
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {}, // no update needed
    create: {
      email: 'user@example.com',
      hash: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
    },
  });

  // Create a bookmark (you can also upsert this if needed)
  await prisma.bookmark.create({
    data: {
      title: 'My First Bookmark',
      link: 'https://example.com',
      description: 'Sample bookmark',
      userId: user.id,
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
