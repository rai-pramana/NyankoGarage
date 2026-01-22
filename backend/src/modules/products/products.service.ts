import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto/product.dto';
import { Prisma } from '@prisma/client';
import { EventsGateway } from '../../events/events.gateway';

@Injectable()
export class ProductsService {
    constructor(
        private readonly prisma: PrismaService,
        private eventsGateway: EventsGateway,
    ) { }

    async create(dto: CreateProductDto, userId: string) {
        // Check for duplicate SKU (only among active products)
        const existing = await this.prisma.product.findFirst({
            where: {
                sku: dto.sku,
                isActive: true,
            },
        });

        if (existing) {
            throw new ConflictException('SKU already exists');
        }

        const { initialStock, ...productData } = dto;

        // Create product with stock in transaction
        const result = await this.prisma.$transaction(async (tx) => {
            const product = await tx.product.create({
                data: {
                    ...productData,
                    costPrice: new Prisma.Decimal(dto.costPrice),
                    sellingPrice: new Prisma.Decimal(dto.sellingPrice),
                },
            });

            // Create initial stock record
            const stock = await tx.stock.create({
                data: {
                    productId: product.id,
                    quantity: initialStock || 0,
                },
            });

            // If initial stock > 0, create stock movement
            if (initialStock && initialStock > 0) {
                await tx.stockMovement.create({
                    data: {
                        productId: product.id,
                        type: 'INIT',
                        quantity: initialStock,
                        balanceAfter: initialStock,
                        notes: 'Initial stock',
                        performedBy: userId,
                    },
                });

                await tx.stock.update({
                    where: { productId: product.id },
                    data: { lastMovementAt: new Date() },
                });
            }

            // Return product with stock (from within transaction)
            return { ...product, stock };
        });

        // Emit WebSocket events for real-time updates
        this.eventsGateway.emitProductChange();
        this.eventsGateway.emitInventoryChange();
        this.eventsGateway.emitDashboardChange();

        return result;
    }

    async findAll(query: ProductQueryDto) {
        const { search, category, status, page = 1, limit = 10 } = query;

        const where: Prisma.ProductWhereInput = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (category) {
            where.category = category;
        }

        // For stock-based filtering (low_stock, out_of_stock), we need to fetch all products
        // first, filter them, then paginate - because stock quantity isn't directly filterable in Prisma
        const needsStockFilter = status === 'low_stock' || status === 'out_of_stock' || status === 'in_stock';

        // Fetch products - get all if filtering by stock, or paginated if not
        const products = await this.prisma.product.findMany({
            where,
            include: {
                stock: true,
                _count: {
                    select: { txnItems: true }
                }
            },
            // Only paginate if NOT filtering by stock status
            ...(needsStockFilter ? {} : { skip: (page - 1) * limit, take: limit }),
            orderBy: { updatedAt: 'desc' },
        });

        // Add canDelete flag and filter by stock status
        let processedProducts = products.map(p => ({
            ...p,
            transactionCount: p._count?.txnItems || 0,
            canDelete: (p._count?.txnItems || 0) === 0,
        }));

        // Apply stock status filter
        if (status === 'low_stock') {
            processedProducts = processedProducts.filter(
                (p) => p.stock && p.stock.quantity > 0 && p.stock.quantity <= p.minStockLevel,
            );
        } else if (status === 'out_of_stock') {
            processedProducts = processedProducts.filter((p) => !p.stock || p.stock.quantity === 0);
        } else if (status === 'in_stock') {
            processedProducts = processedProducts.filter(
                (p) => p.stock && p.stock.quantity > p.minStockLevel,
            );
        }

        // Calculate correct total after filtering
        const totalFiltered = processedProducts.length;

        // If we filtered by stock status, now paginate the filtered results
        const paginatedProducts = needsStockFilter
            ? processedProducts.slice((page - 1) * limit, page * limit)
            : processedProducts;

        // Get total count (filtered or not)
        const total = needsStockFilter
            ? totalFiltered
            : await this.prisma.product.count({ where });

        return {
            data: paginatedProducts,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { stock: true },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return product;
    }

    async update(id: string, dto: UpdateProductDto) {
        await this.findOne(id);

        if (dto.sku) {
            const existing = await this.prisma.product.findFirst({
                where: { sku: dto.sku, NOT: { id } },
            });

            if (existing) {
                throw new ConflictException('SKU already exists');
            }
        }

        const result = await this.prisma.product.update({
            where: { id },
            data: {
                ...dto,
                costPrice: dto.costPrice ? new Prisma.Decimal(dto.costPrice) : undefined,
                sellingPrice: dto.sellingPrice ? new Prisma.Decimal(dto.sellingPrice) : undefined,
            },
            include: { stock: true },
        });

        // Emit WebSocket events
        this.eventsGateway.emitProductChange();
        this.eventsGateway.emitInventoryChange();

        return result;
    }

    async remove(id: string) {
        const product = await this.findOne(id);

        // Check if product has been used in any transactions
        const transactionCount = await this.prisma.transactionItem.count({
            where: { productId: id },
        });

        if (transactionCount > 0) {
            throw new ConflictException(
                `Cannot delete product "${product.name}" - it has been used in ${transactionCount} transaction(s). ` +
                `Consider marking it as inactive instead.`
            );
        }

        // Hard delete - remove product and related records
        await this.prisma.$transaction(async (tx) => {
            // Delete stock movements first
            await tx.stockMovement.deleteMany({
                where: { productId: id },
            });

            // Delete stock record
            await tx.stock.deleteMany({
                where: { productId: id },
            });

            // Delete the product
            await tx.product.delete({
                where: { id },
            });
        });

        // Emit WebSocket events
        this.eventsGateway.emitProductChange();
        this.eventsGateway.emitInventoryChange();
        this.eventsGateway.emitDashboardChange();

        return { message: 'Product deleted successfully', sku: product.sku };
    }

    async getCategories() {
        const categories = await this.prisma.product.findMany({
            where: { category: { not: null } },
            select: { category: true },
            distinct: ['category'],
        });

        return categories.map((c) => c.category).filter(Boolean);
    }
}
