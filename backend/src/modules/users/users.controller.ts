import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { UserRole } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.OWNER, UserRole.ADMIN)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    findAll(@Query() query: { search?: string; role?: UserRole; page?: number; limit?: number }) {
        return this.usersService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Post()
    @Roles(UserRole.OWNER)
    create(@Body() dto: { email: string; password: string; fullName: string; role: UserRole }) {
        return this.usersService.create(dto);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() dto: { fullName?: string; role?: UserRole },
        @Request() req: any,
    ) {
        return this.usersService.update(id, dto, req.user.id);
    }

    @Delete(':id')
    @Roles(UserRole.OWNER)
    deactivate(@Param('id') id: string, @Request() req: any) {
        return this.usersService.deactivate(id, req.user.id);
    }

    @Patch(':id/reactivate')
    @Roles(UserRole.OWNER)
    reactivate(@Param('id') id: string) {
        return this.usersService.reactivate(id);
    }
}
