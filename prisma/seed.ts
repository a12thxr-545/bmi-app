import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // Create demo user
    const hashedPassword = await hash('54567890', 12);

    const demoUser = await prisma.user.upsert({
        where: { username: 'arthur' },
        update: {
            password: hashedPassword,
        },
        create: {
            email: 'arthur@demo.com',
            username: 'arthur',
            password: hashedPassword,
            name: 'Arthur Demo',
            role: 'user',
        },
    });

    console.log('✅ Demo user created/updated:', demoUser.username);
    console.log('📝 Login credentials:');
    console.log('   Username: arthur');
    console.log('   Password: 54567890');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
