import { Controller, Post, Patch, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, RefreshTokenDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { IsString, MinLength, IsEmail } from 'class-validator';

class UpdateProfileDto {
    @IsString()
    fullName: string;
}

class ChangePasswordDto {
    @IsString()
    currentPassword: string;

    @IsString()
    @MinLength(6)
    newPassword: string;
}

class ForgotPasswordDto {
    @IsEmail()
    email: string;
}

class ResetPasswordDto {
    @IsString()
    token: string;

    @IsString()
    @MinLength(6)
    newPassword: string;
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(@Body() dto: RefreshTokenDto) {
        return this.authService.refreshTokens(dto.refreshToken);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async logout(@Request() req: any, @Body() dto: RefreshTokenDto) {
        await this.authService.logout(req.user.id, dto.refreshToken);
        return { message: 'Logged out successfully' };
    }

    @UseGuards(JwtAuthGuard)
    @Post('me')
    @HttpCode(HttpStatus.OK)
    async me(@Request() req: any) {
        return req.user;
    }

    @UseGuards(JwtAuthGuard)
    @Patch('profile')
    async updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
        return this.authService.updateProfile(req.user.id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('change-password')
    @HttpCode(HttpStatus.OK)
    async changePassword(@Request() req: any, @Body() dto: ChangePasswordDto) {
        await this.authService.changePassword(req.user.id, dto);
        return { message: 'Password changed successfully' };
    }

    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    async forgotPassword(@Body() dto: ForgotPasswordDto) {
        return this.authService.forgotPassword(dto.email);
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(dto.token, dto.newPassword);
    }
}
