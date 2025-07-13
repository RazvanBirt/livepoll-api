import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET ?? '';

export const registerUser = async (UserName: string, Email: string, Password: string) => {
    const existingUser = await prisma.user.findUnique({ where: { Email } });
    if (existingUser) {
        return { success: false, error: 'Email already registered' };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    const user = await prisma.user.create({
        data: {
            UserName,
            Email,
            Password: hashedPassword,
            CreatedBy: 'system',
            ModifiedBy: 'system',
        },
    });

    const token = jwt.sign({ id: user.ID, email: user.Email }, SECRET, { expiresIn: '1h' });

    return { success: true, token };
};

export const loginUser = async (Email: string, Password: string) => {
    const user = await prisma.user.findUnique({ where: { Email } });
    if (!user) {
        return { success: false, error: 'Invalid credentials' };
    }

    const match = await bcrypt.compare(Password, user.Password);
    if (!match) {
        return { success: false, error: 'Invalid credentials' };
    }
    const token = jwt.sign({ id: user.ID, email: user.Email }, SECRET, { expiresIn: '1h' });

    return { success: true, token };
};
