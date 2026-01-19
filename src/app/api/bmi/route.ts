import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { calculateBMI } from '@/lib/bmi';

// GET - List all BMI records for current user
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        const records = await prisma.bMIRecord.findMany({
            where: { userId: session.user.id },
            orderBy: { recordedAt: 'desc' },
            take: limit,
            skip: offset,
        });

        const total = await prisma.bMIRecord.count({
            where: { userId: session.user.id },
        });

        return NextResponse.json({ records, total });
    } catch (error) {
        console.error('Error fetching BMI records:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
            { status: 500 }
        );
    }
}

// POST - Create new BMI record
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { weight, height, recordedAt } = await request.json();

        if (!weight || !height) {
            return NextResponse.json(
                { error: 'กรุณากรอกน้ำหนักและส่วนสูง' },
                { status: 400 }
            );
        }

        if (weight <= 0 || height <= 0) {
            return NextResponse.json(
                { error: 'น้ำหนักและส่วนสูงต้องมากกว่า 0' },
                { status: 400 }
            );
        }

        const bmiResult = calculateBMI(weight, height);

        const record = await prisma.bMIRecord.create({
            data: {
                userId: session.user.id,
                weight,
                height,
                bmi: bmiResult.bmi,
                category: bmiResult.category,
                recordedAt: recordedAt ? new Date(recordedAt) : new Date(),
            },
        });

        return NextResponse.json(
            {
                message: 'บันทึกข้อมูลสำเร็จ',
                record,
                bmiResult
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating BMI record:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' },
            { status: 500 }
        );
    }
}
