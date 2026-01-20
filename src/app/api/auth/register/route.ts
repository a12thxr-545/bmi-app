import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { email, username, password, name } = await request.json();

        // Validate input
        if (!email || !username || !password) {
            return NextResponse.json(
                { error: 'Please provide email, username, and password' },
                { status: 400 }
            );
        }

        // Validate username format
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return NextResponse.json(
                { error: 'Username can only contain letters, numbers, and underscores' },
                { status: 400 }
            );
        }

        if (username.length < 3 || username.length > 20) {
            return NextResponse.json(
                { error: 'Username must be between 3 and 20 characters' },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters long' },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingEmail = await prisma.user.findUnique({
            where: { email },
        });

        if (existingEmail) {
            return NextResponse.json(
                { error: 'This email is already registered' },
                { status: 400 }
            );
        }

        // Check if username already exists
        const existingUsername = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUsername) {
            return NextResponse.json(
                { error: 'This username is already taken' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await hash(password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                name: name || null,
            },
        });

        return NextResponse.json(
            {
                message: 'Registration successful',
                user: { id: user.id, email: user.email, username: user.username, name: user.name }
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Error creating account' },
            { status: 500 }
        );
    }
}

