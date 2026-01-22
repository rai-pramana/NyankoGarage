import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';

@Injectable()
export class DashboardService {
    constructor(private readonly prisma: PrismaService) { }

    async getStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // Get products count
        const totalProducts = await this.prisma.product.count({
            where: { isActive: true },
        });

        // Get low stock count
        const productsWithStock = await this.prisma.product.findMany({
            where: { isActive: true },
            include: { stock: true },
        });
        const lowStockCount = productsWithStock.filter(
            p => p.stock && p.stock.quantity <= p.minStockLevel
        ).length;

        // Get today's transactions
        const todayTransactions = await this.prisma.transaction.findMany({
            where: {
                createdAt: { gte: today },
            },
        });

        const todayOrders = todayTransactions.length;
        const todayRevenue = todayTransactions
            .filter(t => t.type === 'SALE' && t.status === 'COMPLETED')
            .reduce((sum, t) => sum + Number(t.totalAmount), 0);

        // Get yesterday's revenue for comparison
        const yesterdayTransactions = await this.prisma.transaction.findMany({
            where: {
                createdAt: { gte: yesterday, lt: today },
                type: 'SALE',
                status: 'COMPLETED',
            },
        });
        const yesterdayRevenue = yesterdayTransactions.reduce((sum, t) => sum + Number(t.totalAmount), 0);

        // Calculate revenue change percentage
        let revenueChange = 0;
        if (yesterdayRevenue > 0) {
            revenueChange = ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
        } else if (todayRevenue > 0) {
            revenueChange = 100;
        }

        return {
            todayRevenue,
            revenueChange: Math.round(revenueChange * 10) / 10,
            todayOrders,
            totalProducts,
            lowStockCount,
        };
    }

    async getRecentTransactions(limit = 15) {
        const transactions = await this.prisma.transaction.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: { product: true },
                },
                createdBy: {
                    select: { fullName: true },
                },
            },
        });

        return transactions.map(t => ({
            id: t.id,
            code: t.code,
            type: t.type,
            customerName: t.customerName || t.supplierName || '-',
            total: Number(t.totalAmount),
            status: t.status,
            createdAt: t.createdAt,
            user: t.createdBy?.fullName || '-',
        }));
    }

    async getLowStockAlerts(limit?: number) {
        const products = await this.prisma.product.findMany({
            where: { isActive: true },
            include: { stock: true },
        });

        // Get both low stock and out of stock products
        let stockAlerts = products
            .filter(p => p.stock && p.stock.quantity <= p.minStockLevel)
            .map(p => ({
                id: p.id,
                name: p.name,
                sku: p.sku,
                quantity: p.stock?.quantity || 0,
                minStockLevel: p.minStockLevel,
                alertType: (p.stock?.quantity || 0) === 0 ? 'out_of_stock' : 'low_stock',
            }))
            // Sort by quantity ascending (out of stock first, then low stock)
            .sort((a, b) => a.quantity - b.quantity);

        // Apply limit if provided
        if (limit) {
            stockAlerts = stockAlerts.slice(0, limit);
        }

        return stockAlerts;
    }
}

