"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var adapter_pg_1 = require("@prisma/adapter-pg");
var pg_1 = require("pg");
var bcrypt = require("bcrypt");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var connectionString, pool, adapter, prisma, passwordHash, owner, admin, staff, warehouse, productsData, _i, productsData_1, p, product, products, txn1, txn2, txn3, txn4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
                    pool = new pg_1.Pool({ connectionString: connectionString });
                    adapter = new adapter_pg_1.PrismaPg(pool);
                    prisma = new client_1.PrismaClient({ adapter: adapter });
                    console.log('🌱 Starting seed...');
                    // Clean existing data
                    console.log('🧹 Cleaning existing data...');
                    return [4 /*yield*/, prisma.transactionLog.deleteMany()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, prisma.transactionItem.deleteMany()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, prisma.transaction.deleteMany()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, prisma.stockMovement.deleteMany()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, prisma.stock.deleteMany()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, prisma.product.deleteMany()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, prisma.session.deleteMany()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, prisma.user.deleteMany()];
                case 8:
                    _a.sent();
                    // Create Users
                    console.log('👤 Creating users...');
                    return [4 /*yield*/, bcrypt.hash('password123', 10)];
                case 9:
                    passwordHash = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: 'owner@nyanko.garage',
                                passwordHash: passwordHash,
                                fullName: 'Alice Smith',
                                role: client_1.UserRole.OWNER,
                            },
                        })];
                case 10:
                    owner = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: 'admin@nyanko.garage',
                                passwordHash: passwordHash,
                                fullName: 'Bob Johnson',
                                role: client_1.UserRole.ADMIN,
                            },
                        })];
                case 11:
                    admin = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: 'staff@nyanko.garage',
                                passwordHash: passwordHash,
                                fullName: 'Diana Prince',
                                role: client_1.UserRole.STAFF,
                            },
                        })];
                case 12:
                    staff = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: 'warehouse@nyanko.garage',
                                passwordHash: passwordHash,
                                fullName: 'Charlie Day',
                                role: client_1.UserRole.WAREHOUSE,
                            },
                        })];
                case 13:
                    warehouse = _a.sent();
                    console.log("\u2705 Created ".concat(4, " users"));
                    // Create Products with Stock
                    console.log('📦 Creating products...');
                    productsData = [
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
                    _i = 0, productsData_1 = productsData;
                    _a.label = 14;
                case 14:
                    if (!(_i < productsData_1.length)) return [3 /*break*/, 19];
                    p = productsData_1[_i];
                    return [4 /*yield*/, prisma.product.create({
                            data: {
                                sku: p.sku,
                                name: p.name,
                                category: p.category,
                                costPrice: p.costPrice,
                                sellingPrice: p.sellingPrice,
                                unit: p.unit,
                                minStockLevel: 10,
                            },
                        })];
                case 15:
                    product = _a.sent();
                    return [4 /*yield*/, prisma.stock.create({
                            data: {
                                productId: product.id,
                                quantity: p.stock,
                                lastMovementAt: new Date(),
                            },
                        })];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, prisma.stockMovement.create({
                            data: {
                                productId: product.id,
                                type: client_1.StockMovementType.INIT,
                                quantity: p.stock,
                                balanceAfter: p.stock,
                                notes: 'Initial stock',
                                performedBy: owner.id,
                            },
                        })];
                case 17:
                    _a.sent();
                    _a.label = 18;
                case 18:
                    _i++;
                    return [3 /*break*/, 14];
                case 19:
                    console.log("\u2705 Created ".concat(productsData.length, " products with stock"));
                    // Create Transactions
                    console.log('💰 Creating transactions...');
                    return [4 /*yield*/, prisma.product.findMany({ include: { stock: true } })];
                case 20:
                    products = _a.sent();
                    return [4 /*yield*/, prisma.transaction.create({
                            data: {
                                code: 'TRX-2024-0001',
                                type: client_1.TransactionType.SALE,
                                status: client_1.TransactionStatus.COMPLETED,
                                customerName: 'John Mechanic',
                                subtotal: 450.00,
                                taxAmount: 36.00,
                                totalAmount: 486.00,
                                createdById: staff.id,
                                confirmedById: admin.id,
                                completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                            },
                        })];
                case 21:
                    txn1 = _a.sent();
                    return [4 /*yield*/, prisma.transactionItem.create({
                            data: {
                                transactionId: txn1.id,
                                productId: products[0].id,
                                quantity: 3,
                                unitPrice: 45.00,
                                lineTotal: 135.00,
                            },
                        })];
                case 22:
                    _a.sent();
                    return [4 /*yield*/, prisma.transactionItem.create({
                            data: {
                                transactionId: txn1.id,
                                productId: products[1].id,
                                quantity: 2,
                                unitPrice: 65.00,
                                lineTotal: 130.00,
                            },
                        })];
                case 23:
                    _a.sent();
                    return [4 /*yield*/, prisma.transaction.create({
                            data: {
                                code: 'TRX-2024-0002',
                                type: client_1.TransactionType.PURCHASE,
                                status: client_1.TransactionStatus.CONFIRMED,
                                supplierName: 'Global Auto Supplies',
                                subtotal: 1200.00,
                                taxAmount: 96.00,
                                totalAmount: 1296.00,
                                createdById: admin.id,
                                confirmedById: owner.id,
                            },
                        })];
                case 24:
                    txn2 = _a.sent();
                    return [4 /*yield*/, prisma.transactionItem.create({
                            data: {
                                transactionId: txn2.id,
                                productId: products[6].id,
                                quantity: 10,
                                unitPrice: 80.00,
                                lineTotal: 800.00,
                            },
                        })];
                case 25:
                    _a.sent();
                    return [4 /*yield*/, prisma.transaction.create({
                            data: {
                                code: 'TRX-2024-0003',
                                type: client_1.TransactionType.SALE,
                                status: client_1.TransactionStatus.DRAFT,
                                customerName: 'Mike Ross',
                                subtotal: 150.00,
                                totalAmount: 150.00,
                                createdById: staff.id,
                            },
                        })];
                case 26:
                    txn3 = _a.sent();
                    return [4 /*yield*/, prisma.transactionItem.create({
                            data: {
                                transactionId: txn3.id,
                                productId: products[5].id,
                                quantity: 2,
                                unitPrice: 28.00,
                                lineTotal: 56.00,
                            },
                        })];
                case 27:
                    _a.sent();
                    return [4 /*yield*/, prisma.transaction.create({
                            data: {
                                code: 'TRX-2024-0004',
                                type: client_1.TransactionType.SALE,
                                status: client_1.TransactionStatus.COMPLETED,
                                customerName: 'Alice Mechanic',
                                subtotal: 890.00,
                                taxAmount: 71.20,
                                totalAmount: 961.20,
                                createdById: staff.id,
                                confirmedById: admin.id,
                                completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                            },
                        })];
                case 28:
                    txn4 = _a.sent();
                    return [4 /*yield*/, prisma.transactionItem.create({
                            data: {
                                transactionId: txn4.id,
                                productId: products[6].id,
                                quantity: 2,
                                unitPrice: 150.00,
                                lineTotal: 300.00,
                            },
                        })];
                case 29:
                    _a.sent();
                    // Transaction 5: Canceled Purchase
                    return [4 /*yield*/, prisma.transaction.create({
                            data: {
                                code: 'TRX-2024-0005',
                                type: client_1.TransactionType.PURCHASE,
                                status: client_1.TransactionStatus.CANCELED,
                                supplierName: 'Turbo Parts Inc.',
                                subtotal: 2500.00,
                                totalAmount: 2500.00,
                                createdById: admin.id,
                                notes: 'Canceled due to supplier issues',
                            },
                        })];
                case 30:
                    // Transaction 5: Canceled Purchase
                    _a.sent();
                    console.log("\u2705 Created 5 transactions");
                    console.log('');
                    console.log('🎉 Seed completed successfully!');
                    console.log('');
                    console.log('📋 Test accounts (password: password123):');
                    console.log('  - owner@nyanko.garage (Owner)');
                    console.log('  - admin@nyanko.garage (Admin)');
                    console.log('  - staff@nyanko.garage (Staff)');
                    console.log('  - warehouse@nyanko.garage (Warehouse)');
                    return [4 /*yield*/, prisma.$disconnect()];
                case 31:
                    _a.sent();
                    return [4 /*yield*/, pool.end()];
                case 32:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error('❌ Seed failed:', e);
    process.exit(1);
});
