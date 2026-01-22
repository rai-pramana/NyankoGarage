import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, TransactionQueryDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { UserRole } from '@prisma/client';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) { }

    @Post()
    @UseGuards(RolesGuard)
    @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.STAFF)
    create(@Body() dto: CreateTransactionDto, @Request() req: any) {
        return this.transactionsService.create(dto, req.user.id);
    }

    @Get()
    findAll(@Query() query: TransactionQueryDto) {
        return this.transactionsService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.transactionsService.findOne(id);
    }

    @Patch(':id/confirm')
    @UseGuards(RolesGuard)
    @Roles(UserRole.OWNER, UserRole.ADMIN)
    confirm(@Param('id') id: string, @Request() req: any) {
        return this.transactionsService.confirm(id, req.user.id);
    }

    @Patch(':id/complete')
    @UseGuards(RolesGuard)
    @Roles(UserRole.OWNER, UserRole.ADMIN)
    complete(@Param('id') id: string, @Request() req: any) {
        return this.transactionsService.complete(id, req.user.id);
    }

    @Patch(':id/cancel')
    @UseGuards(RolesGuard)
    @Roles(UserRole.OWNER, UserRole.ADMIN)
    cancel(@Param('id') id: string, @Request() req: any) {
        return this.transactionsService.cancel(id, req.user.id);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.OWNER)
    delete(@Param('id') id: string) {
        return this.transactionsService.delete(id);
    }
}
