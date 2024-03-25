
import fs from 'fs';
import { faker } from '@faker-js/faker';

interface Category {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
}

function generateCategories(count: number): Category[] {
    const categories: Category[] = [];
    for (let i = 0; i < count; i++) {
        const category: Category = {
            id: faker.datatype.uuid() as string,
            name: faker.commerce.department() as string,
            description: faker.lorem.sentence() as string,
            createdAt: faker.date.past() as Date,
        };
        categories.push(category);
    }
    return categories;
}

const categories: Category[] = generateCategories(100);

// Write categories to a JSON file
const jsonData: string = JSON.stringify(categories, null, 2);
fs.writeFileSync('categories.json', jsonData);

console.log('Categories exported to categories.json');

