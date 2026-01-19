import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { calculateBMI } from '@/lib/bmi';

// GET - Get single BMI record
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const record = await prisma.bMIRecord.findFirst({
            where: {
                id,
                userId: session.user.id
            },
        });

        if (!record) {
            return NextResponse.json({ error: 'ไม่พบข้อมูล' }, { status: 404 });
        }

        return NextResponse.json(record);
    } catch (error) {
        console.error('Error fetching BMI record:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
            { status: 500 }
        );
    }
}

// PUT - Update BMI record
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const { weight, height, recordedAt } = await request.json();

        // Check if record exists and belongs to user
        const existingRecord = await prisma.bMIRecord.findFirst({
            where: {
                id,
                userId: session.user.id
            },
        });

        if (!existingRecord) {
            return NextResponse.json({ error: 'ไม่พบข้อมูล' }, { status: 404 });
        }

        const bmiResult = calculateBMI(weight, height);

        const record = await prisma.bMIRecord.update({
            where: { id },
            data: {
                weight,
                height,
                bmi: bmiResult.bmi,
                category: bmiResult.category,
                recordedAt: recordedAt ? new Date(recordedAt) : existingRecord.recordedAt,
            },
        });

        return NextResponse.json({
            message: 'อัปเดตข้อมูลสำเร็จ',
            record,
            bmiResult
        });
    } catch (error) {
        console.error('Error updating BMI record:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' },
            { status: 500 }
        );
    }
}

// DELETE - Delete BMI record
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Check if record exists and belongs to user
        const existingRecord = await prisma.bMIRecord.findFirst({
            where: {
                id,
                userId: session.user.id
            },
        });

        if (!existingRecord) {
            return NextResponse.json({ error: 'ไม่พบข้อมูล' }, { status: 404 });
        }

        await prisma.bMIRecord.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'ลบข้อมูลสำเร็จ' });
    } catch (error) {
        console.error('Error deleting BMI record:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการลบข้อมูล' },
            { status: 500 }
        );
    }
}
