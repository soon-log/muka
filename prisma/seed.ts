import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const questions = [
  {
    id: 1,
    template: '나한테 어울리는 음악은?',
    description: '나에게 어울리는 노래를 추천받고 싶을 때',
    category: 'relationship',
    order: 1,
  },
  {
    id: 2,
    template: '내가 힘들 때 들으면 좋을 음악은?',
    description: '위로가 필요할 때 들을 노래를 추천받고 싶을 때',
    category: 'relationship',
    order: 2,
  },
  {
    id: 3,
    template: '나를 생각하면 떠오르는 음악은?',
    description: '친구가 나를 떠올릴 때 생각나는 노래가 궁금할 때',
    category: 'relationship',
    order: 3,
  },
  {
    id: 4,
    template: '요즘 네가 꽂힌 음악은?',
    description: '친구가 요즘 빠진 노래가 궁금할 때',
    category: 'situation',
    order: 4,
  },
  {
    id: 5,
    template: '아무 생각 없이 들을 수 있는 음악 추천해줘',
    description: '편하게 들을 수 있는 노래를 추천받고 싶을 때',
    category: 'situation',
    order: 5,
  },
  {
    id: 6,
    template: '인생 노래 하나만 추천해줘',
    description: '친구의 인생 노래가 궁금할 때',
    category: 'situation',
    order: 6,
  },
  {
    id: 7,
    template: '비 오는 날 듣기 좋은 음악은?',
    description: '비 오는 날 분위기에 맞는 노래를 추천받고 싶을 때',
    category: 'situation',
    order: 7,
  },
];

async function main(): Promise<void> {
  // eslint-disable-next-line no-console
  console.log('Seeding database...');

  for (const question of questions) {
    await prisma.question.upsert({
      where: { id: question.id },
      update: {
        template: question.template,
        description: question.description,
        category: question.category,
        order: question.order,
      },
      create: question,
    });
  }

  // eslint-disable-next-line no-console
  console.log(`Seeded ${String(questions.length)} questions`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e: unknown) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
