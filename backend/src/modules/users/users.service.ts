import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findAll(query: { search?: string; role?: UserRole; page?: number; limit?: number }) {
        const { search, role, page = 1, limit = 20 } = query;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { fullName: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (role) {
            where.role = role;
        }

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                    role: true,
                    isActive: true,
                    lastLogin: true,
                    createdAt: true,
                },
            }),
            this.prisma.user.count({ where }),
        ]);

        return {
            data: users,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                isActive: true,
                lastLogin: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async create(dto: { email: string; password: string; fullName: string; role: UserRole }) {
        const existing = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existing) {
            throw new ConflictException('Email already registered');
        }

        const passwordHash = await bcrypt.hash(dto.password, 10);

        return this.prisma.user.create({
            data: {
                email: dto.email,
                passwordHash,
                fullName: dto.fullName,
                role: dto.role,
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        });
    }

    async update(id: string, dto: { fullName?: string; role?: UserRole }, requesterId: string) {
        const user = await this.findOne(id);

        // Prevent modifying own role
        if (id === requesterId && dto.role) {
            throw new ForbiddenException('Cannot change your own role');
        }

        return this.prisma.user.update({
            where: { id },
            data: {
                fullName: dto.fullName,
                role: dto.role,
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                isActive: true,
                updatedAt: true,
            },
        });
    }

    async deactivate(id: string, requesterId: string) {
        if (id === requesterId) {
            throw new ForbiddenException('Cannot deactivate your own account');
        }

        return this.prisma.user.update({
            where: { id },
            data: { isActive: false },
        });
    }

    async reactivate(id: string) {
        return this.prisma.user.update({
            where: { id },
            data: { isActive: true },
        });
    }
}
