import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReportsService {
    constructor(private prisma: PrismaService) { }

    async getSalesReport(startDate?: string, endDate?: string) {
        const where: any = {
            type: 'SALE',
            status: 'COMPLETED',
        };

        if (startDate && endDate) {
            where.createdAt = {
                gte: new Date(startDate),
                lte: new Date(endDate + 'T23:59:59.999Z'),
            };
        }

        // Get all sales in period
        const sales = await this.prisma.transaction.findMany({
            where,
            include: {
                items: {
                    include: { product: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        // Calculate totals
        const totalRevenue = sales.reduce((sum, s) => sum + Number(s.totalAmount), 0);
        const totalOrders = sales.length;
        const totalItems = sales.reduce((sum, s) => sum + s.items.reduce((itemSum, i) => itemSum + i.quantity, 0), 0);

        // Top selling products
        const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};
        sales.forEach(sale => {
            sale.items.forEach(item => {
                const key = item.productId;
                if (!productSales[key]) {
                    productSales[key] = { name: item.product.name, quantity: 0, revenue: 0 };
                }
                productSales[key].quantity += item.quantity;
                productSales[key].revenue += item.quantity * Number(item.product.sellingPrice);
            });
        });

        const topProducts = Object.values(productSales)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);

        // Sales by day
        const salesByDay: Record<string, number> = {};
        sales.forEach(sale => {
            const day = new Date(sale.createdAt).toISOString().split('T')[0];
            salesByDay[day] = (salesByDay[day] || 0) + Number(sale.totalAmount);
        });

        // Recent transactions for display
        const recentSales = sales.slice(0, 10).map(s => ({
            id: s.id,
            code: s.code,
            customerName: s.customerName,
            totalAmount: s.totalAmount,
            status: s.status,
            createdAt: s.createdAt,
            itemCount: s.items.length,
        }));

        // All sales for CSV export
        const allSales = sales.map(s => ({
            id: s.id,
            code: s.code,
            customerName: s.customerName,
            totalAmount: s.totalAmount,
            status: s.status,
            createdAt: s.createdAt,
            itemCount: s.items.length,
        }));

        return {
            summary: {
                totalRevenue,
                totalOrders,
                totalItems,
                averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
            },
            topProducts,
            salesByDay: Object.entries(salesByDay).map(([date, amount]) => ({ date, amount })),
            recentSales,
            allSales,
        };
    }

    async getInventoryReport() {
        const products = await this.prisma.product.findMany({
            where: { isActive: true },
            include: { stock: true },
            orderBy: { name: 'asc' },
        });

        const inventory = products.map(p => ({
            id: p.id,
            name: p.name,
            sku: p.sku,
            category: p.category,
            quantity: p.stock?.quantity || 0,
            minStockLevel: p.minStockLevel,
            costPrice: Number(p.costPrice),
            stockValue: (p.stock?.quantity || 0) * Number(p.costPrice),
            isLowStock: (p.stock?.quantity || 0) > 0 && (p.stock?.quantity || 0) <= p.minStockLevel,
            isOutOfStock: (p.stock?.quantity || 0) === 0,
        }));

        const totalProducts = inventory.length;
        const totalUnits = inventory.reduce((sum, i) => sum + i.quantity, 0);
        const totalValue = inventory.reduce((sum, i) => sum + i.stockValue, 0);
        const lowStockCount = inventory.filter(i => i.isLowStock && !i.isOutOfStock).length;
        const outOfStockCount = inventory.filter(i => i.isOutOfStock).length;

        // Group by category
        const byCategory: Record<string, { count: number; value: number; units: number }> = {};
        inventory.forEach(i => {
            const cat = i.category || 'Uncategorized';
            if (!byCategory[cat]) {
                byCategory[cat] = { count: 0, value: 0, units: 0 };
            }
            byCategory[cat].count++;
            byCategory[cat].value += i.stockValue;
            byCategory[cat].units += i.quantity;
        });

        return {
            summary: {
                totalProducts,
                totalUnits,
                totalValue,
                lowStockCount,
                outOfStockCount,
            },
            byCategory: Object.entries(byCategory).map(([category, data]) => ({ category, ...data })),
            items: inventory,
        };
    }

    async getPurchaseReport(startDate?: string, endDate?: string) {
        const where: any = {
            type: 'PURCHASE',
            status: 'COMPLETED',
        };

        if (startDate && endDate) {
            where.createdAt = {
                gte: new Date(startDate),
                lte: new Date(endDate + 'T23:59:59.999Z'),
            };
        }

        const purchases = await this.prisma.transaction.findMany({
            where,
            include: {
                items: {
                    include: { product: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        const totalSpent = purchases.reduce((sum, p) => sum + Number(p.totalAmount), 0);
        const totalOrders = purchases.length;
        const totalItems = purchases.reduce((sum, p) => sum + p.items.reduce((itemSum, i) => itemSum + i.quantity, 0), 0);

        // By supplier
        const bySupplier: Record<string, { count: number; total: number }> = {};
        purchases.forEach(p => {
            const supplier = p.supplierName || 'Unknown';
            if (!bySupplier[supplier]) {
                bySupplier[supplier] = { count: 0, total: 0 };
            }
            bySupplier[supplier].count++;
            bySupplier[supplier].total += Number(p.totalAmount);
        });

        const recentPurchases = purchases.slice(0, 10).map(p => ({
            id: p.id,
            code: p.code,
            supplierName: p.supplierName,
            totalAmount: p.totalAmount,
            status: p.status,
            createdAt: p.createdAt,
            itemCount: p.items.length,
        }));

        // All purchases for CSV export
        const allPurchases = purchases.map(p => ({
            id: p.id,
            code: p.code,
            supplierName: p.supplierName,
            totalAmount: p.totalAmount,
            status: p.status,
            createdAt: p.createdAt,
            itemCount: p.items.length,
        }));

        return {
            summary: {
                totalSpent,
                totalOrders,
                totalItems,
                averageOrderValue: totalOrders > 0 ? totalSpent / totalOrders : 0,
            },
            bySupplier: Object.entries(bySupplier).map(([supplier, data]) => ({ supplier, ...data })),
            recentPurchases,
            allPurchases,
        };
    }

    async getProfitReport(startDate?: string, endDate?: string) {
        const dateFilter = startDate && endDate ? {
            createdAt: {
                gte: new Date(startDate),
                lte: new Date(endDate + 'T23:59:59.999Z'),
            },
        } : {};

        // Get sales
        const sales = await this.prisma.transaction.findMany({
            where: {
                type: 'SALE',
                status: 'COMPLETED',
                ...dateFilter,
            },
            include: {
                items: {
                    include: { product: true },
                },
            },
        });

        // Get purchases
        const purchases = await this.prisma.transaction.findMany({
            where: {
                type: 'PURCHASE',
                status: 'COMPLETED',
                ...dateFilter,
            },
        });

        const totalRevenue = sales.reduce((sum, s) => sum + Number(s.totalAmount), 0);
        const totalCost = sales.reduce((sum, s) => {
            // Calculate cost of goods sold
            return sum + s.items.reduce((itemSum, item) => {
                return itemSum + (item.quantity * Number(item.product.costPrice));
            }, 0);
        }, 0);
        const totalPurchases = purchases.reduce((sum, p) => sum + Number(p.totalAmount), 0);

        const grossProfit = totalRevenue - totalCost;
        const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
        const netProfit = totalRevenue - totalPurchases;

        return {
            summary: {
                totalRevenue,
                totalCost,
                grossProfit,
                grossMargin: Number(grossMargin.toFixed(1)),
                totalPurchases,
                netProfit,
            },
            salesCount: sales.length,
            purchaseCount: purchases.length,
        };
    }

    async getActivityLog(limit = 50) {
        // Get recent stock movements
        const movements = await this.prisma.stockMovement.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                product: { select: { name: true, sku: true } },
                user: { select: { fullName: true } },
            },
        });

        // Get recent transactions
        const transactions = await this.prisma.transaction.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                createdBy: { select: { fullName: true } },
            },
        });

        // Combine and sort activities
        const activities = [
            ...movements.map(m => ({
                id: m.id,
                type: 'stock_movement',
                action: m.type,
                description: `${m.type.replace('_', ' ')} - ${m.product.name} (${m.quantity > 0 ? '+' : ''}${m.quantity})`,
                user: m.user?.fullName || 'System',
                createdAt: m.createdAt,
            })),
            ...transactions.map(t => ({
                id: t.id,
                type: 'transaction',
                action: t.type,
                description: `${t.type} - ${t.code} (${Number(t.totalAmount).toFixed(2)})`,
                user: t.createdBy?.fullName || 'System',
                createdAt: t.createdAt,
            })),
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, limit);

        return activities;
    }
}
