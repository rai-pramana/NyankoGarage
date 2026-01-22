import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma';
import { LoginDto, RegisterDto } from './dto';
import { User } from '@prisma/client';

export interface TokenPayload {
    sub: string;
    email: string;
    role: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async register(dto: RegisterDto): Promise<{ user: Partial<User>; tokens: AuthTokens }> {
        // Check if user exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        // Hash password
        const passwordHash = await bcrypt.hash(dto.password, 10);

        // Create user
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                passwordHash,
                fullName: dto.fullName,
            },
        });

        // Generate tokens
        const tokens = await this.generateTokens(user);

        // Save refresh token
        await this.saveRefreshToken(user.id, tokens.refreshToken);

        return {
            user: this.sanitizeUser(user),
            tokens,
        };
    }

    async login(dto: LoginDto): Promise<{ user: Partial<User>; tokens: AuthTokens }> {
        // Find user
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user || !user.isActive) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Verify password
        const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);

        if (!passwordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Update last login
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });

        // Generate tokens
        const tokens = await this.generateTokens(user);

        // Save refresh token
        await this.saveRefreshToken(user.id, tokens.refreshToken);

        return {
            user: this.sanitizeUser(user),
            tokens,
        };
    }

    async refreshTokens(refreshToken: string): Promise<AuthTokens> {
        try {
            const payload = this.jwtService.verify<TokenPayload>(refreshToken, {
                secret: this.configService.get<string>('JWT_SECRET') || 'default-secret',
            });

            // Find session
            const session = await this.prisma.session.findFirst({
                where: {
                    userId: payload.sub,
                    refreshToken,
                    expiresAt: { gt: new Date() },
                },
                include: { user: true },
            });

            if (!session) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            // Generate new tokens
            const tokens = await this.generateTokens(session.user);

            // Update session with new refresh token
            await this.prisma.session.update({
                where: { id: session.id },
                data: {
                    refreshToken: tokens.refreshToken,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                },
            });

            return tokens;
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async logout(userId: string, refreshToken: string): Promise<void> {
        await this.prisma.session.deleteMany({
            where: {
                userId,
                refreshToken,
            },
        });
    }

    async validateUser(payload: TokenPayload): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id: payload.sub },
        });
    }

    private async generateTokens(user: User): Promise<AuthTokens> {
        const payload: TokenPayload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        const secret = this.configService.get<string>('JWT_SECRET') || 'default-secret';

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret,
                expiresIn: 900, // 15 minutes in seconds
            }),
            this.jwtService.signAsync(payload, {
                secret,
                expiresIn: 604800, // 7 days in seconds
            }),
        ]);

        return { accessToken, refreshToken };
    }

    private async saveRefreshToken(userId: string, refreshToken: string): Promise<void> {
        await this.prisma.session.create({
            data: {
                userId,
                refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
        });
    }

    private sanitizeUser(user: User): Partial<User> {
        const { passwordHash, ...sanitized } = user;
        return sanitized;
    }

    async updateProfile(userId: string, dto: { fullName: string }): Promise<Partial<User>> {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: { fullName: dto.fullName },
        });
        return this.sanitizeUser(user);
    }

    async changePassword(userId: string, dto: { currentPassword: string; newPassword: string }): Promise<void> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // Verify current password
        const passwordValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
        if (!passwordValid) {
            throw new UnauthorizedException('Current password is incorrect');
        }

        // Hash and update new password
        const passwordHash = await bcrypt.hash(dto.newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { passwordHash },
        });
    }
}
