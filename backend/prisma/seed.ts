import { PrismaClient, UserRole, TransactionType, TransactionStatus, StockMovementType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

async function main() {
    // Use DIRECT_URL for seeding (bypasses pgbouncer which doesn't support transactions well)
    const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    console.log('🌱 Starting seed...');

    // Clean existing data
    console.log('🧹 Cleaning existing data...');
    await prisma.transactionLog.deleteMany();
    await prisma.transactionItem.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.stockMovement.deleteMany();
    await prisma.stock.deleteMany();
    await prisma.product.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();

    // Create Users
    console.log('👤 Creating users...');
    const passwordHash = await bcrypt.hash('password123', 10);

    const owner = await prisma.user.create({
        data: {
            email: 'owner@nyanko.garage',
            passwordHash,
            fullName: 'Alice Smith',
            role: UserRole.OWNER,
        },
    });

    const admin = await prisma.user.create({
        data: {
            email: 'admin@nyanko.garage',
            passwordHash,
            fullName: 'Bob Johnson',
            role: UserRole.ADMIN,
        },
    });

    const staff = await prisma.user.create({
        data: {
            email: 'staff@nyanko.garage',
            passwordHash,
            fullName: 'Diana Prince',
            role: UserRole.STAFF,
        },
    });

    const warehouse = await prisma.user.create({
        data: {
            email: 'warehouse@nyanko.garage',
            passwordHash,
            fullName: 'Charlie Day',
            role: UserRole.WAREHOUSE,
        },
    });

    console.log(`✅ Created ${4} users`);

    // Create Products with Stock
    console.log('📦 Creating products...');
    const productsData = [
        { sku: 'OIL-5W30', name: 'Engine Oil 5W-30 (5L)', category: 'Fluids', costPrice: 25.00, sellingPrice: 45.00, unit: 'bottle', stock: 45 },
        { sku: 'BRK-PAD-F', name: 'Brake Pads - Front', category: 'Brakes', costPrice: 35.00, sellingPrice: 65.00, unit: 'set', stock: 5 },
        { sku: 'BRK-PAD-R', name: 'Brake Pads - Rear', category: 'Brakes', costPrice: 30.00, sellingPrice: 55.00, unit: 'set', stock: 8 },
        { sku: 'FLT-AIR', name: 'Air Filter - Universal', category: 'Filters', costPrice: 8.00, sellingPrice: 18.00, unit: 'pcs', stock: 2 },
        { sku: 'FLT-OIL', name: 'Oil Filter - Standard', category: 'Filters', costPrice: 5.00, sellingPrice: 12.00, unit: 'pcs', stock: 30 },
        { sku: 'SPK-4PK', name: 'Spark Plugs (4-pack)', category: 'Ignition', costPrice: 15.00, sellingPrice: 28.00, unit: 'pack', stock: 8 },
        { sku: 'BAT-12V', name: 'Car Battery 12V 60Ah', category: 'Electrical', costPrice: 80.00, sellingPrice: 150.00, unit: 'pcs', stock: 12 },
        { sku: 'WPR-BLD', name: 'Wiper Blades (Pair)', category: 'Accessories', costPrice: 10.00, sellingPrice: 22.00, unit: 'pair', stock: 25 },
        { sku: 'CLN-WND', name: 'Windshield Cleaner 4L', category: 'Fluids', costPrice: 6.00, sellingPrice: 15.00, unit: 'bottle', stock: 40 },
        { sku: 'TRF-ATF', name: 'Transmission Fluid ATF', category: 'Fluids', costPrice: 18.00, sellingPrice: 35.00, unit: 'bottle', stock: 20 },
        { sku: 'CLT-COL', name: 'Coolant Concentrate 1L', category: 'Fluids', costPrice: 12.00, sellingPrice: 25.00, unit: 'bottle', stock: 35 },
        { sku: 'BLT-SRP', name: 'Serpentine Belt', category: 'Engine', costPrice: 25.00, sellingPrice: 48.00, unit: 'pcs', stock: 6 },
    ];

    for (const p of productsData) {
        const product = await prisma.product.create({
            data: {
                sku: p.sku,
                name: p.name,
                category: p.category,
                costPrice: p.costPrice,
                sellingPrice: p.sellingPrice,
                unit: p.unit,
                minStockLevel: 10,
            },
        });

        await prisma.stock.create({
            data: {
                productId: product.id,
                quantity: p.stock,
                lastMovementAt: new Date(),
            },
        });

        await prisma.stockMovement.create({
            data: {
                productId: product.id,
                type: StockMovementType.INIT,
                quantity: p.stock,
                balanceAfter: p.stock,
                notes: 'Initial stock',
                performedBy: owner.id,
            },
        });
    }

    console.log(`✅ Created ${productsData.length} products with stock`);

    // Create Transactions
    console.log('💰 Creating transactions...');
    const products = await prisma.product.findMany({ include: { stock: true } });

    // Transaction 1: Completed Sale
    const txn1 = await prisma.transaction.create({
        data: {
            code: 'TRX-2024-0001',
            type: TransactionType.SALE,
            status: TransactionStatus.COMPLETED,
            customerName: 'John Mechanic',
            subtotal: 450.00,
            taxAmount: 36.00,
            totalAmount: 486.00,
            createdById: staff.id,
            confirmedById: admin.id,
            completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
    });

    await prisma.transactionItem.create({
        data: {
            transactionId: txn1.id,
            productId: products[0].id,
            quantity: 3,
            unitPrice: 45.00,
            lineTotal: 135.00,
        },
    });

    await prisma.transactionItem.create({
        data: {
            transactionId: txn1.id,
            productId: products[1].id,
            quantity: 2,
            unitPrice: 65.00,
            lineTotal: 130.00,
        },
    });

    // Transaction 2: Confirmed Purchase  
    const txn2 = await prisma.transaction.create({
        data: {
            code: 'TRX-2024-0002',
            type: TransactionType.PURCHASE,
            status: TransactionStatus.CONFIRMED,
            supplierName: 'Global Auto Supplies',
            subtotal: 1200.00,
            taxAmount: 96.00,
            totalAmount: 1296.00,
            createdById: admin.id,
            confirmedById: owner.id,
        },
    });

    await prisma.transactionItem.create({
        data: {
            transactionId: txn2.id,
            productId: products[6].id,
            quantity: 10,
            unitPrice: 80.00,
            lineTotal: 800.00,
        },
    });

    // Transaction 3: Draft Sale
    const txn3 = await prisma.transaction.create({
        data: {
            code: 'TRX-2024-0003',
            type: TransactionType.SALE,
            status: TransactionStatus.DRAFT,
            customerName: 'Mike Ross',
            subtotal: 150.00,
            totalAmount: 150.00,
            createdById: staff.id,
        },
    });

    await prisma.transactionItem.create({
        data: {
            transactionId: txn3.id,
            productId: products[5].id,
            quantity: 2,
            unitPrice: 28.00,
            lineTotal: 56.00,
        },
    });

    // Transaction 4: Completed Sale
    const txn4 = await prisma.transaction.create({
        data: {
            code: 'TRX-2024-0004',
            type: TransactionType.SALE,
            status: TransactionStatus.COMPLETED,
            customerName: 'Alice Mechanic',
            subtotal: 890.00,
            taxAmount: 71.20,
            totalAmount: 961.20,
            createdById: staff.id,
            confirmedById: admin.id,
            completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
    });

    await prisma.transactionItem.create({
        data: {
            transactionId: txn4.id,
            productId: products[6].id,
            quantity: 2,
            unitPrice: 150.00,
            lineTotal: 300.00,
        },
    });

    // Transaction 5: Canceled Purchase
    await prisma.transaction.create({
        data: {
            code: 'TRX-2024-0005',
            type: TransactionType.PURCHASE,
            status: TransactionStatus.CANCELED,
            supplierName: 'Turbo Parts Inc.',
            subtotal: 2500.00,
            totalAmount: 2500.00,
            createdById: admin.id,
            notes: 'Canceled due to supplier issues',
        },
    });

    console.log(`✅ Created 5 transactions`);

    console.log('');
    console.log('🎉 Seed completed successfully!');
    console.log('');
    console.log('📋 Test accounts (password: password123):');
    console.log('  - owner@nyanko.garage (Owner)');
    console.log('  - admin@nyanko.garage (Admin)');
    console.log('  - staff@nyanko.garage (Staff)');
    console.log('  - warehouse@nyanko.garage (Warehouse)');

    await prisma.$disconnect();
    await pool.end();
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    });
