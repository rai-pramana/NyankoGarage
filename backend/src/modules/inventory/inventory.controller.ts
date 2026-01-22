import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { InventoryService, StockAdjustmentDto } from './inventory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { UserRole } from '@prisma/client';

@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    @Get()
    findAll(
        @Query('search') search?: string,
        @Query('category') category?: string,
        @Query('stockStatus') stockStatus?: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.inventoryService.findAll({ search, category, stockStatus, page, limit });
    }

    @Get('low-stock')
    getLowStockAlerts() {
        return this.inventoryService.getLowStockAlerts();
    }

    @Get('movements')
    getMovements(
        @Query('productId') productId?: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.inventoryService.getMovements(productId, page, limit);
    }

    @Post('adjust')
    @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.WAREHOUSE)
    adjustStock(@Body() dto: StockAdjustmentDto, @Request() req: any) {
        return this.inventoryService.adjustStock(dto, req.user.id);
    }
}
