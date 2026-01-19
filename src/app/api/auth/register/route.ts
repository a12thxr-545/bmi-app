import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { email, password, name } = await request.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { error: 'กรุณากรอกอีเมลและรหัสผ่าน' },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'อีเมลนี้ถูกใช้งานแล้ว' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await hash(password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || null,
            },
        });

        return NextResponse.json(
            {
                message: 'ลงทะเบียนสำเร็จ',
                user: { id: user.id, email: user.email, name: user.name }
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการลงทะเบียน' },
            { status: 500 }
        );
    }
}
