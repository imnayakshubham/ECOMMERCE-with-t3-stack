import { PrismaClient } from '@prisma/client';
import { categories } from './categoriesData';

const prisma = new PrismaClient();

async function main() {
    await prisma.category.deleteMany();
    for (const category_name of categories) {
        await prisma.category.create({
            data: {
                category_name: category_name
            }
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    }).finally(async () => {
        await prisma.$disconnect();
    });