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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsService = void 0;
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var TransactionsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var TransactionsService = _classThis = /** @class */ (function () {
        function TransactionsService_1(prisma) {
            this.prisma = prisma;
        }
        TransactionsService_1.prototype.create = function (dto, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var count, code, subtotal, itemsWithTotals, taxAmount, totalAmount, transaction;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.transaction.count()];
                        case 1:
                            count = _a.sent();
                            code = "TRX-".concat(new Date().getFullYear(), "-").concat(String(count + 1).padStart(4, '0'));
                            subtotal = 0;
                            itemsWithTotals = dto.items.map(function (item) {
                                var lineTotal = item.quantity * item.unitPrice;
                                subtotal += lineTotal;
                                return __assign(__assign({}, item), { lineTotal: lineTotal });
                            });
                            taxAmount = subtotal * 0.08;
                            totalAmount = subtotal + taxAmount;
                            return [4 /*yield*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var txn;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, tx.transaction.create({
                                                    data: {
                                                        code: code,
                                                        type: dto.type,
                                                        status: client_1.TransactionStatus.DRAFT,
                                                        customerName: dto.customerName,
                                                        supplierName: dto.supplierName,
                                                        notes: dto.notes,
                                                        subtotal: subtotal,
                                                        taxAmount: taxAmount,
                                                        totalAmount: totalAmount,
                                                        createdById: userId,
                                                        items: {
                                                            create: itemsWithTotals.map(function (item) { return ({
                                                                productId: item.productId,
                                                                quantity: item.quantity,
                                                                unitPrice: item.unitPrice,
                                                                lineTotal: item.lineTotal,
                                                            }); }),
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
                                                })];
                                            case 1:
                                                txn = _a.sent();
                                                return [2 /*return*/, txn];
                                        }
                                    });
                                }); })];
                        case 2:
                            transaction = _a.sent();
                            return [2 /*return*/, transaction];
                    }
                });
            });
        };
        TransactionsService_1.prototype.findAll = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var search, type, status, _a, page, _b, limit, skip, where, allTransactions, summary, _c, transactions, total;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            search = query.search, type = query.type, status = query.status, _a = query.page, page = _a === void 0 ? 1 : _a, _b = query.limit, limit = _b === void 0 ? 20 : _b;
                            skip = (page - 1) * limit;
                            where = {};
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
                            return [4 /*yield*/, this.prisma.transaction.findMany({
                                    where: where,
                                    orderBy: { createdAt: 'desc' },
                                })];
                        case 1:
                            allTransactions = _d.sent();
                            summary = {
                                totalSales: allTransactions
                                    .filter(function (t) { return t.type === 'SALE'; })
                                    .reduce(function (sum, t) { return sum + Number(t.totalAmount); }, 0),
                                totalPurchases: allTransactions
                                    .filter(function (t) { return t.type === 'PURCHASE'; })
                                    .reduce(function (sum, t) { return sum + Number(t.totalAmount); }, 0),
                                pendingCount: allTransactions
                                    .filter(function (t) { return t.status === 'DRAFT' || t.status === 'CONFIRMED'; })
                                    .length,
                            };
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.transaction.findMany({
                                        where: where,
                                        skip: skip,
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
                                    this.prisma.transaction.count({ where: where }),
                                ])];
                        case 2:
                            _c = _d.sent(), transactions = _c[0], total = _c[1];
                            return [2 /*return*/, {
                                    data: transactions,
                                    meta: {
                                        page: page,
                                        limit: limit,
                                        total: total,
                                        totalPages: Math.ceil(total / limit),
                                    },
                                    summary: summary,
                                }];
                    }
                });
            });
        };
        TransactionsService_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var transaction;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.transaction.findUnique({
                                where: { id: id },
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
                            })];
                        case 1:
                            transaction = _a.sent();
                            if (!transaction) {
                                throw new common_1.NotFoundException('Transaction not found');
                            }
                            return [2 /*return*/, transaction];
                    }
                });
            });
        };
        TransactionsService_1.prototype.confirm = function (id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var transaction;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            transaction = _a.sent();
                            if (transaction.status !== client_1.TransactionStatus.DRAFT) {
                                throw new common_1.BadRequestException('Only draft transactions can be confirmed');
                            }
                            return [2 /*return*/, this.prisma.transaction.update({
                                    where: { id: id },
                                    data: {
                                        status: client_1.TransactionStatus.CONFIRMED,
                                        confirmedById: userId,
                                        logs: {
                                            create: {
                                                action: 'Confirmed',
                                                performedBy: userId,
                                            },
                                        },
                                    },
                                })];
                    }
                });
            });
        };
        TransactionsService_1.prototype.complete = function (id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var transaction, stockIssues, _i, _a, item, stock, availableQty;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.prisma.transaction.findUnique({
                                where: { id: id },
                                include: {
                                    items: {
                                        include: { product: true }
                                    }
                                },
                            })];
                        case 1:
                            transaction = _b.sent();
                            if (!transaction) {
                                throw new common_1.NotFoundException('Transaction not found');
                            }
                            if (transaction.status !== client_1.TransactionStatus.CONFIRMED) {
                                throw new common_1.BadRequestException('Only confirmed transactions can be completed');
                            }
                            if (!(transaction.type === 'SALE')) return [3 /*break*/, 6];
                            stockIssues = [];
                            _i = 0, _a = transaction.items;
                            _b.label = 2;
                        case 2:
                            if (!(_i < _a.length)) return [3 /*break*/, 5];
                            item = _a[_i];
                            return [4 /*yield*/, this.prisma.stock.findUnique({
                                    where: { productId: item.productId },
                                })];
                        case 3:
                            stock = _b.sent();
                            availableQty = (stock === null || stock === void 0 ? void 0 : stock.quantity) || 0;
                            if (availableQty === 0) {
                                stockIssues.push("".concat(item.product.name, " (").concat(item.product.sku, "): Out of stock"));
                            }
                            else if (availableQty < item.quantity) {
                                stockIssues.push("".concat(item.product.name, " (").concat(item.product.sku, "): Only ").concat(availableQty, " available, need ").concat(item.quantity));
                            }
                            _b.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5:
                            if (stockIssues.length > 0) {
                                throw new common_1.BadRequestException({
                                    message: 'Insufficient stock for one or more products',
                                    issues: stockIssues,
                                });
                            }
                            _b.label = 6;
                        case 6: 
                        // Update stock levels
                        return [4 /*yield*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                var _i, _a, item, stock, quantityChange, newQuantity;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _i = 0, _a = transaction.items;
                                            _b.label = 1;
                                        case 1:
                                            if (!(_i < _a.length)) return [3 /*break*/, 6];
                                            item = _a[_i];
                                            return [4 /*yield*/, tx.stock.findUnique({
                                                    where: { productId: item.productId },
                                                })];
                                        case 2:
                                            stock = _b.sent();
                                            if (!stock)
                                                return [3 /*break*/, 5];
                                            quantityChange = transaction.type === 'SALE' ? -item.quantity : item.quantity;
                                            newQuantity = stock.quantity + quantityChange;
                                            return [4 /*yield*/, tx.stock.update({
                                                    where: { productId: item.productId },
                                                    data: {
                                                        quantity: newQuantity,
                                                        lastMovementAt: new Date(),
                                                    },
                                                })];
                                        case 3:
                                            _b.sent();
                                            return [4 /*yield*/, tx.stockMovement.create({
                                                    data: {
                                                        productId: item.productId,
                                                        type: transaction.type === 'SALE' ? client_1.StockMovementType.SALE_OUT : client_1.StockMovementType.PURCHASE_IN,
                                                        quantity: quantityChange,
                                                        balanceAfter: newQuantity,
                                                        referenceType: 'Transaction',
                                                        referenceId: transaction.id,
                                                        performedBy: userId,
                                                    },
                                                })];
                                        case 4:
                                            _b.sent();
                                            _b.label = 5;
                                        case 5:
                                            _i++;
                                            return [3 /*break*/, 1];
                                        case 6: return [4 /*yield*/, tx.transaction.update({
                                                where: { id: id },
                                                data: {
                                                    status: client_1.TransactionStatus.COMPLETED,
                                                    completedAt: new Date(),
                                                    logs: {
                                                        create: {
                                                            action: 'Completed',
                                                            performedBy: userId,
                                                        },
                                                    },
                                                },
                                            })];
                                        case 7:
                                            _b.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                        case 7:
                            // Update stock levels
                            _b.sent();
                            return [2 /*return*/, this.findOne(id)];
                    }
                });
            });
        };
        TransactionsService_1.prototype.cancel = function (id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var transaction;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            transaction = _a.sent();
                            if (transaction.status === client_1.TransactionStatus.COMPLETED) {
                                throw new common_1.BadRequestException('Completed transactions cannot be canceled');
                            }
                            return [2 /*return*/, this.prisma.transaction.update({
                                    where: { id: id },
                                    data: {
                                        status: client_1.TransactionStatus.CANCELED,
                                        logs: {
                                            create: {
                                                action: 'Canceled',
                                                performedBy: userId,
                                            },
                                        },
                                    },
                                })];
                    }
                });
            });
        };
        TransactionsService_1.prototype.delete = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var transaction;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            transaction = _a.sent();
                            if (transaction.status === client_1.TransactionStatus.COMPLETED) {
                                throw new common_1.BadRequestException('Completed transactions cannot be deleted');
                            }
                            // Delete transaction (items and logs are cascade deleted via schema)
                            return [4 /*yield*/, this.prisma.transaction.delete({
                                    where: { id: id },
                                })];
                        case 2:
                            // Delete transaction (items and logs are cascade deleted via schema)
                            _a.sent();
                            return [2 /*return*/, { message: 'Transaction deleted successfully' }];
                    }
                });
            });
        };
        return TransactionsService_1;
    }());
    __setFunctionName(_classThis, "TransactionsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TransactionsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TransactionsService = _classThis;
}();
exports.TransactionsService = TransactionsService;
