import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { Prisma, StockMovementType } from '@prisma/client';
import { IsString, IsNumber, IsOptional, IsIn } from 'class-validator';
import { EventsGateway } from '../../events/events.gateway';

export class StockAdjustmentDto {
    @IsString()
    productId: string;

    @IsIn(['add', 'remove', 'set'])
    type: 'add' | 'remove' | 'set';

    @IsNumber()
    quantity: number;

    @IsString()
    reason: string;

    @IsString()
    @IsOptional()
    notes?: string;
}

@Injectable()
export class InventoryService {
    constructor(
        private readonly prisma: PrismaService,
        private eventsGateway: EventsGateway,
    ) { }

    async findAll(query: { search?: string; category?: string; stockStatus?: string; page?: number; limit?: number }) {
        const { search, category, stockStatus, page = 1, limit = 10 } = query;

        const where: Prisma.ProductWhereInput = { isActive: true };

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (category) {
            where.category = category;
        }

        // Always fetch all matching products first for accurate stats and filtering
        const allProducts = await this.prisma.product.findMany({
            where,
            include: { stock: true },
            orderBy: { name: 'asc' },
        });

        // Apply stock status filter if specified
        let filtered = allProducts;
        if (stockStatus === 'in_stock') {
            filtered = allProducts.filter(p => (p.stock?.quantity || 0) > p.minStockLevel);
        } else if (stockStatus === 'low_stock') {
            filtered = allProducts.filter(p => p.stock && p.stock.quantity > 0 && p.stock.quantity <= p.minStockLevel);
        } else if (stockStatus === 'out_of_stock') {
            filtered = allProducts.filter(p => (p.stock?.quantity || 0) === 0);
        }

        // Calculate totals
        const totalFiltered = filtered.length;

        // Paginate - always paginate from filtered results
        const paginatedProducts = filtered.slice((page - 1) * limit, page * limit);

        const total = filtered.length;

        // Calculate summary stats from ALL filtered products (not just paginated)
        const summaryStats = {
            totalUnits: filtered.reduce((sum, p) => sum + (p.stock?.quantity || 0), 0),
            totalValue: filtered.reduce((sum, p) => sum + (p.stock?.quantity || 0) * Number(p.costPrice || 0), 0),
            lowStockCount: filtered.filter(p => p.stock && p.stock.quantity <= p.minStockLevel).length,
        };

        return {
            data: paginatedProducts.map((p) => ({
                id: p.id,
                sku: p.sku,
                name: p.name,
                category: p.category,
                costPrice: Number(p.costPrice) || 0,
                quantity: p.stock?.quantity || 0,
                reservedQty: p.stock?.reservedQty || 0,
                available: (p.stock?.quantity || 0) - (p.stock?.reservedQty || 0),
                minStockLevel: p.minStockLevel,
                isLowStock: p.stock ? p.stock.quantity <= p.minStockLevel : false,
                lastMovementAt: p.stock?.lastMovementAt,
            })),
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
            summary: summaryStats,
        };
    }

    async getLowStockAlerts() {
        const products = await this.prisma.product.findMany({
            where: { isActive: true },
            include: { stock: true },
        });

        return products
            .filter((p) => p.stock && p.stock.quantity <= p.minStockLevel)
            .map((p) => ({
                id: p.id,
                sku: p.sku,
                name: p.name,
                quantity: p.stock?.quantity || 0,
                minStockLevel: p.minStockLevel,
                isCritical: p.stock ? p.stock.quantity === 0 : true,
            }));
    }

    async adjustStock(dto: StockAdjustmentDto, userId: string) {
        const stock = await this.prisma.stock.findUnique({
            where: { productId: dto.productId },
            include: { product: true },
        });

        if (!stock) {
            throw new NotFoundException('Product stock not found');
        }

        let newQuantity: number;
        let movementQty: number;

        switch (dto.type) {
            case 'add':
                newQuantity = stock.quantity + dto.quantity;
                movementQty = dto.quantity;
                break;
            case 'remove':
                if (dto.quantity > stock.quantity) {
                    throw new BadRequestException('Cannot remove more than available stock');
                }
                newQuantity = stock.quantity - dto.quantity;
                movementQty = -dto.quantity;
                break;
            case 'set':
                movementQty = dto.quantity - stock.quantity;
                newQuantity = dto.quantity;
                break;
            default:
                throw new BadRequestException('Invalid adjustment type');
        }

        const result = await this.prisma.$transaction(async (tx) => {
            // Update stock
            await tx.stock.update({
                where: { productId: dto.productId },
                data: {
                    quantity: newQuantity,
                    lastMovementAt: new Date(),
                },
            });

            // Create movement record
            await tx.stockMovement.create({
                data: {
                    productId: dto.productId,
                    type: StockMovementType.ADJUST,
                    quantity: movementQty,
                    balanceAfter: newQuantity,
                    notes: `${dto.reason}${dto.notes ? ': ' + dto.notes : ''}`,
                    performedBy: userId,
                },
            });

            return {
                productId: dto.productId,
                previousQuantity: stock.quantity,
                newQuantity,
                adjustment: movementQty,
            };
        });

        // Emit WebSocket events for real-time updates
        this.eventsGateway.emitInventoryChange();
        this.eventsGateway.emitDashboardChange();
        this.eventsGateway.emitProductChange();

        return result;
    }

    async getMovements(productId?: string, page = 1, limit = 20) {
        const skip = (page - 1) * limit;

        const where: Prisma.StockMovementWhereInput = {};
        if (productId) {
            where.productId = productId;
        }

        const movements = await this.prisma.stockMovement.findMany({
            where,
            include: {
                product: { select: { name: true, sku: true } },
                user: { select: { fullName: true } },
            },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });

        const total = await this.prisma.stockMovement.count({ where });

        return {
            data: movements,
            meta: { total, page, limit },
        };
    }
}
