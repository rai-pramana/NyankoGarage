import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Get('sales')
    getSalesReport(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        return this.reportsService.getSalesReport(startDate, endDate);
    }

    @Get('inventory')
    getInventoryReport() {
        return this.reportsService.getInventoryReport();
    }

    @Get('purchases')
    getPurchaseReport(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        return this.reportsService.getPurchaseReport(startDate, endDate);
    }

    @Get('profit')
    getProfitReport(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        return this.reportsService.getProfitReport(startDate, endDate);
    }

    @Get('activity')
    getActivityLog(@Query('limit') limit?: number) {
        return this.reportsService.getActivityLog(limit ? Number(limit) : undefined);
    }
}
