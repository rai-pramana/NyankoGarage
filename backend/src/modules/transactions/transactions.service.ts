import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTransactionDto, TransactionQueryDto } from './dto';
import { TransactionStatus, StockMovementType } from '@prisma/client';

@Injectable()
export class TransactionsService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateTransactionDto, userId: string) {
        // Generate unique transaction code using timestamp and random suffix
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        const code = `TRX-${year}${month}${day}-${random}`;

        // Calculate totals
        let subtotal = 0;
        const itemsWithTotals = dto.items.map(item => {
            const lineTotal = item.quantity * item.unitPrice;
            subtotal += lineTotal;
            return { ...item, lineTotal };
        });

        const taxAmount = subtotal * 0.08; // 8% tax
        const totalAmount = subtotal + taxAmount;

        // Create transaction with items
        const transaction = await this.prisma.$transaction(async (tx) => {
            const txn = await tx.transaction.create({
                data: {
                    code,
                    type: dto.type,
                    status: TransactionStatus.DRAFT,
                    customerName: dto.customerName,
                    supplierName: dto.supplierName,
                    notes: dto.notes,
                    subtotal,
                    taxAmount,
                    totalAmount,
                    createdById: userId,
                    items: {
                        create: itemsWithTotals.map(item => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            lineTotal: item.lineTotal,
                        })),
                    },
                },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                    createdBy: {
                        select: { id: true, fullName: true, email: true },
                    },
                },
            });

            return txn;
        });

        return transaction;
    }

    async findAll(query: TransactionQueryDto) {
        const { search, type, status, page = 1, limit = 20 } = query;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.OR = [
                { code: { contains: search, mode: 'insensitive' } },
                { customerName: { contains: search, mode: 'insensitive' } },
                { supplierName: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (type) {
            where.type = type;
        }

        if (status) {
            where.status = status;
        }

        // Fetch all matching transactions for summary stats
        const allTransactions = await this.prisma.transaction.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        // Calculate summary stats - only include COMPLETED by default
        // If filtering by DRAFT or CANCELED, include those statuses in summary
        const summaryStatuses = status
            ? [status]
            : ['COMPLETED'];

        const summaryTransactions = allTransactions.filter(t =>
            summaryStatuses.includes(t.status as string)
        );

        const summary = {
            totalSales: summaryTransactions
                .filter(t => t.type === 'SALE')
                .reduce((sum, t) => sum + Number(t.totalAmount), 0),
            totalPurchases: summaryTransactions
                .filter(t => t.type === 'PURCHASE')
                .reduce((sum, t) => sum + Number(t.totalAmount), 0),
            pendingCount: allTransactions
                .filter(t => t.status === 'DRAFT')
                .length,
        };

        // Get paginated transactions for display
        const [transactions, total] = await Promise.all([
            this.prisma.transaction.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    items: {
                        include: {
                            product: {
                                select: { id: true, name: true, sku: true },
                            },
                        },
                    },
                    createdBy: {
                        select: { id: true, fullName: true },
                    },
                },
            }),
            this.prisma.transaction.count({ where }),
        ]);

        return {
            data: transactions,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            summary,
        };
    }

    async findOne(id: string) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                createdBy: {
                    select: { id: true, fullName: true, email: true },
                },
                confirmedBy: {
                    select: { id: true, fullName: true },
                },
                logs: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        return transaction;
    }

    async confirm(id: string, userId: string) {
        const transaction = await this.findOne(id);

        if (transaction.status !== TransactionStatus.DRAFT) {
            throw new BadRequestException('Only draft transactions can be confirmed');
        }

        return this.prisma.transaction.update({
            where: { id },
            data: {
                status: TransactionStatus.CONFIRMED,
                confirmedById: userId,
                logs: {
                    create: {
                        action: 'Confirmed',
                        performedBy: userId,
                    },
                },
            },
        });
    }

    async complete(id: string, userId: string) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id },
            include: {
                items: {
                    include: { product: true }
                }
            },
        });

        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        if (transaction.status !== TransactionStatus.DRAFT) {
            throw new BadRequestException('Only draft transactions can be completed');
        }

        // For SALE transactions, validate stock availability
        if (transaction.type === 'SALE') {
            const stockIssues: string[] = [];

            for (const item of transaction.items) {
                const stock = await this.prisma.stock.findUnique({
                    where: { productId: item.productId },
                });

                const availableQty = stock?.quantity || 0;

                if (availableQty === 0) {
                    stockIssues.push(`${item.product.name} (${item.product.sku}): Out of stock`);
                } else if (availableQty < item.quantity) {
                    stockIssues.push(`${item.product.name} (${item.product.sku}): Only ${availableQty} available, need ${item.quantity}`);
                }
            }

            if (stockIssues.length > 0) {
                throw new BadRequestException({
                    message: 'Insufficient stock for one or more products',
                    issues: stockIssues,
                });
            }
        }

        // Update stock levels
        await this.prisma.$transaction(async (tx) => {
            for (const item of transaction.items) {
                const stock = await tx.stock.findUnique({
                    where: { productId: item.productId },
                });

                if (!stock) continue;

                const quantityChange = transaction.type === 'SALE' ? -item.quantity : item.quantity;
                const newQuantity = stock.quantity + quantityChange;

                await tx.stock.update({
                    where: { productId: item.productId },
                    data: {
                        quantity: newQuantity,
                        lastMovementAt: new Date(),
                    },
                });

                await tx.stockMovement.create({
                    data: {
                        productId: item.productId,
                        type: transaction.type === 'SALE' ? StockMovementType.SALE_OUT : StockMovementType.PURCHASE_IN,
                        quantity: quantityChange,
                        balanceAfter: newQuantity,
                        referenceType: 'Transaction',
                        referenceId: transaction.id,
                        performedBy: userId,
                    },
                });
            }

            await tx.transaction.update({
                where: { id },
                data: {
                    status: TransactionStatus.COMPLETED,
                    completedAt: new Date(),
                    logs: {
                        create: {
                            action: 'Completed',
                            performedBy: userId,
                        },
                    },
                },
            });
        });

        return this.findOne(id);
    }

    async cancel(id: string, userId: string) {
        const transaction = await this.findOne(id);

        if (transaction.status === TransactionStatus.COMPLETED) {
            throw new BadRequestException('Completed transactions cannot be canceled');
        }

        return this.prisma.transaction.update({
            where: { id },
            data: {
                status: TransactionStatus.CANCELED,
                logs: {
                    create: {
                        action: 'Canceled',
                        performedBy: userId,
                    },
                },
            },
        });
    }

    async delete(id: string) {
        const transaction = await this.findOne(id);

        if (transaction.status === TransactionStatus.COMPLETED) {
            throw new BadRequestException('Completed transactions cannot be deleted');
        }

        // Delete transaction (items and logs are cascade deleted via schema)
        await this.prisma.transaction.delete({
            where: { id },
        });

        return { message: 'Transaction deleted successfully' };
    }
}
