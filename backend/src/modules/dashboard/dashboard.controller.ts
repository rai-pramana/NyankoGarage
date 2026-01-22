import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('stats')
    getStats() {
        return this.dashboardService.getStats();
    }

    @Get('recent-transactions')
    getRecentTransactions() {
        return this.dashboardService.getRecentTransactions();
    }

    @Get('low-stock-alerts')
    getLowStockAlerts(@Query('limit') limit?: number) {
        return this.dashboardService.getLowStockAlerts(limit ? Number(limit) : undefined);
    }
}
