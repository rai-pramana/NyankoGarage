"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
var common_1 = require("@nestjs/common");
var ReportsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ReportsService = _classThis = /** @class */ (function () {
        function ReportsService_1(prisma) {
            this.prisma = prisma;
        }
        ReportsService_1.prototype.getSalesReport = function (startDate, endDate) {
            return __awaiter(this, void 0, void 0, function () {
                var where, sales, totalRevenue, totalOrders, totalItems, productSales, topProducts, salesByDay, recentSales;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            where = {
                                type: 'SALE',
                                status: { in: ['CONFIRMED', 'COMPLETED'] },
                            };
                            if (startDate && endDate) {
                                where.createdAt = {
                                    gte: new Date(startDate),
                                    lte: new Date(endDate + 'T23:59:59.999Z'),
                                };
                            }
                            return [4 /*yield*/, this.prisma.transaction.findMany({
                                    where: where,
                                    include: {
                                        items: {
                                            include: { product: true },
                                        },
                                    },
                                    orderBy: { createdAt: 'desc' },
                                })];
                        case 1:
                            sales = _a.sent();
                            totalRevenue = sales.reduce(function (sum, s) { return sum + Number(s.totalAmount); }, 0);
                            totalOrders = sales.length;
                            totalItems = sales.reduce(function (sum, s) { return sum + s.items.reduce(function (itemSum, i) { return itemSum + i.quantity; }, 0); }, 0);
                            productSales = {};
                            sales.forEach(function (sale) {
                                sale.items.forEach(function (item) {
                                    var key = item.productId;
                                    if (!productSales[key]) {
                                        productSales[key] = { name: item.product.name, quantity: 0, revenue: 0 };
                                    }
                                    productSales[key].quantity += item.quantity;
                                    productSales[key].revenue += item.quantity * Number(item.product.sellingPrice);
                                });
                            });
                            topProducts = Object.values(productSales)
                                .sort(function (a, b) { return b.revenue - a.revenue; })
                                .slice(0, 10);
                            salesByDay = {};
                            sales.forEach(function (sale) {
                                var day = new Date(sale.createdAt).toISOString().split('T')[0];
                                salesByDay[day] = (salesByDay[day] || 0) + Number(sale.totalAmount);
                            });
                            recentSales = sales.slice(0, 10).map(function (s) { return ({
                                id: s.id,
                                code: s.code,
                                customerName: s.customerName,
                                totalAmount: s.totalAmount,
                                status: s.status,
                                createdAt: s.createdAt,
                                itemCount: s.items.length,
                            }); });
                            return [2 /*return*/, {
                                    summary: {
                                        totalRevenue: totalRevenue,
                                        totalOrders: totalOrders,
                                        totalItems: totalItems,
                                        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
                                    },
                                    topProducts: topProducts,
                                    salesByDay: Object.entries(salesByDay).map(function (_a) {
                                        var date = _a[0], amount = _a[1];
                                        return ({ date: date, amount: amount });
                                    }),
                                    recentSales: recentSales,
                                }];
                    }
                });
            });
        };
        ReportsService_1.prototype.getInventoryReport = function () {
            return __awaiter(this, void 0, void 0, function () {
                var products, inventory, totalProducts, totalUnits, totalValue, lowStockCount, outOfStockCount, byCategory;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.product.findMany({
                                where: { isActive: true },
                                include: { stock: true },
                                orderBy: { name: 'asc' },
                            })];
                        case 1:
                            products = _a.sent();
                            inventory = products.map(function (p) {
                                var _a, _b, _c, _d, _e;
                                return ({
                                    id: p.id,
                                    name: p.name,
                                    sku: p.sku,
                                    category: p.category,
                                    quantity: ((_a = p.stock) === null || _a === void 0 ? void 0 : _a.quantity) || 0,
                                    minStockLevel: p.minStockLevel,
                                    costPrice: Number(p.costPrice),
                                    stockValue: (((_b = p.stock) === null || _b === void 0 ? void 0 : _b.quantity) || 0) * Number(p.costPrice),
                                    isLowStock: (((_c = p.stock) === null || _c === void 0 ? void 0 : _c.quantity) || 0) > 0 && (((_d = p.stock) === null || _d === void 0 ? void 0 : _d.quantity) || 0) <= p.minStockLevel,
                                    isOutOfStock: (((_e = p.stock) === null || _e === void 0 ? void 0 : _e.quantity) || 0) === 0,
                                });
                            });
                            totalProducts = inventory.length;
                            totalUnits = inventory.reduce(function (sum, i) { return sum + i.quantity; }, 0);
                            totalValue = inventory.reduce(function (sum, i) { return sum + i.stockValue; }, 0);
                            lowStockCount = inventory.filter(function (i) { return i.isLowStock && !i.isOutOfStock; }).length;
                            outOfStockCount = inventory.filter(function (i) { return i.isOutOfStock; }).length;
                            byCategory = {};
                            inventory.forEach(function (i) {
                                var cat = i.category || 'Uncategorized';
                                if (!byCategory[cat]) {
                                    byCategory[cat] = { count: 0, value: 0, units: 0 };
                                }
                                byCategory[cat].count++;
                                byCategory[cat].value += i.stockValue;
                                byCategory[cat].units += i.quantity;
                            });
                            return [2 /*return*/, {
                                    summary: {
                                        totalProducts: totalProducts,
                                        totalUnits: totalUnits,
                                        totalValue: totalValue,
                                        lowStockCount: lowStockCount,
                                        outOfStockCount: outOfStockCount,
                                    },
                                    byCategory: Object.entries(byCategory).map(function (_a) {
                                        var category = _a[0], data = _a[1];
                                        return (__assign({ category: category }, data));
                                    }),
                                    items: inventory,
                                }];
                    }
                });
            });
        };
        ReportsService_1.prototype.getPurchaseReport = function (startDate, endDate) {
            return __awaiter(this, void 0, void 0, function () {
                var where, purchases, totalSpent, totalOrders, totalItems, bySupplier, recentPurchases;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            where = {
                                type: 'PURCHASE',
                                status: { in: ['CONFIRMED', 'COMPLETED'] },
                            };
                            if (startDate && endDate) {
                                where.createdAt = {
                                    gte: new Date(startDate),
                                    lte: new Date(endDate + 'T23:59:59.999Z'),
                                };
                            }
                            return [4 /*yield*/, this.prisma.transaction.findMany({
                                    where: where,
                                    include: {
                                        items: {
                                            include: { product: true },
                                        },
                                    },
                                    orderBy: { createdAt: 'desc' },
                                })];
                        case 1:
                            purchases = _a.sent();
                            totalSpent = purchases.reduce(function (sum, p) { return sum + Number(p.totalAmount); }, 0);
                            totalOrders = purchases.length;
                            totalItems = purchases.reduce(function (sum, p) { return sum + p.items.reduce(function (itemSum, i) { return itemSum + i.quantity; }, 0); }, 0);
                            bySupplier = {};
                            purchases.forEach(function (p) {
                                var supplier = p.supplierName || 'Unknown';
                                if (!bySupplier[supplier]) {
                                    bySupplier[supplier] = { count: 0, total: 0 };
                                }
                                bySupplier[supplier].count++;
                                bySupplier[supplier].total += Number(p.totalAmount);
                            });
                            recentPurchases = purchases.slice(0, 10).map(function (p) { return ({
                                id: p.id,
                                code: p.code,
                                supplierName: p.supplierName,
                                totalAmount: p.totalAmount,
                                status: p.status,
                                createdAt: p.createdAt,
                                itemCount: p.items.length,
                            }); });
                            return [2 /*return*/, {
                                    summary: {
                                        totalSpent: totalSpent,
                                        totalOrders: totalOrders,
                                        totalItems: totalItems,
                                        averageOrderValue: totalOrders > 0 ? totalSpent / totalOrders : 0,
                                    },
                                    bySupplier: Object.entries(bySupplier).map(function (_a) {
                                        var supplier = _a[0], data = _a[1];
                                        return (__assign({ supplier: supplier }, data));
                                    }),
                                    recentPurchases: recentPurchases,
                                }];
                    }
                });
            });
        };
        ReportsService_1.prototype.getProfitReport = function (startDate, endDate) {
            return __awaiter(this, void 0, void 0, function () {
                var dateFilter, sales, purchases, totalRevenue, totalCost, totalPurchases, grossProfit, grossMargin, netProfit;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            dateFilter = startDate && endDate ? {
                                createdAt: {
                                    gte: new Date(startDate),
                                    lte: new Date(endDate + 'T23:59:59.999Z'),
                                },
                            } : {};
                            return [4 /*yield*/, this.prisma.transaction.findMany({
                                    where: __assign({ type: 'SALE', status: { in: ['CONFIRMED', 'COMPLETED'] } }, dateFilter),
                                    include: {
                                        items: {
                                            include: { product: true },
                                        },
                                    },
                                })];
                        case 1:
                            sales = _a.sent();
                            return [4 /*yield*/, this.prisma.transaction.findMany({
                                    where: __assign({ type: 'PURCHASE', status: { in: ['CONFIRMED', 'COMPLETED'] } }, dateFilter),
                                })];
                        case 2:
                            purchases = _a.sent();
                            totalRevenue = sales.reduce(function (sum, s) { return sum + Number(s.totalAmount); }, 0);
                            totalCost = sales.reduce(function (sum, s) {
                                // Calculate cost of goods sold
                                return sum + s.items.reduce(function (itemSum, item) {
                                    return itemSum + (item.quantity * Number(item.product.costPrice));
                                }, 0);
                            }, 0);
                            totalPurchases = purchases.reduce(function (sum, p) { return sum + Number(p.totalAmount); }, 0);
                            grossProfit = totalRevenue - totalCost;
                            grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
                            netProfit = totalRevenue - totalPurchases;
                            return [2 /*return*/, {
                                    summary: {
                                        totalRevenue: totalRevenue,
                                        totalCost: totalCost,
                                        grossProfit: grossProfit,
                                        grossMargin: Number(grossMargin.toFixed(1)),
                                        totalPurchases: totalPurchases,
                                        netProfit: netProfit,
                                    },
                                    salesCount: sales.length,
                                    purchaseCount: purchases.length,
                                }];
                    }
                });
            });
        };
        ReportsService_1.prototype.getActivityLog = function () {
            return __awaiter(this, arguments, void 0, function (limit) {
                var movements, transactions, activities;
                if (limit === void 0) { limit = 50; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.stockMovement.findMany({
                                take: limit,
                                orderBy: { createdAt: 'desc' },
                                include: {
                                    product: { select: { name: true, sku: true } },
                                    user: { select: { fullName: true } },
                                },
                            })];
                        case 1:
                            movements = _a.sent();
                            return [4 /*yield*/, this.prisma.transaction.findMany({
                                    take: limit,
                                    orderBy: { createdAt: 'desc' },
                                    include: {
                                        createdBy: { select: { fullName: true } },
                                    },
                                })];
                        case 2:
                            transactions = _a.sent();
                            activities = __spreadArray(__spreadArray([], movements.map(function (m) {
                                var _a;
                                return ({
                                    id: m.id,
                                    type: 'stock_movement',
                                    action: m.type,
                                    description: "".concat(m.type.replace('_', ' '), " - ").concat(m.product.name, " (").concat(m.quantity > 0 ? '+' : '').concat(m.quantity, ")"),
                                    user: ((_a = m.user) === null || _a === void 0 ? void 0 : _a.fullName) || 'System',
                                    createdAt: m.createdAt,
                                });
                            }), true), transactions.map(function (t) {
                                var _a;
                                return ({
                                    id: t.id,
                                    type: 'transaction',
                                    action: t.type,
                                    description: "".concat(t.type, " - ").concat(t.code, " (").concat(Number(t.totalAmount).toFixed(2), ")"),
                                    user: ((_a = t.createdBy) === null || _a === void 0 ? void 0 : _a.fullName) || 'System',
                                    createdAt: t.createdAt,
                                });
                            }), true).sort(function (a, b) { return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); })
                                .slice(0, limit);
                            return [2 /*return*/, activities];
                    }
                });
            });
        };
        return ReportsService_1;
    }());
    __setFunctionName(_classThis, "ReportsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReportsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReportsService = _classThis;
}();
exports.ReportsService = ReportsService;
