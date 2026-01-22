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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var ProductsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProductsService = _classThis = /** @class */ (function () {
        function ProductsService_1(prisma) {
            this.prisma = prisma;
        }
        ProductsService_1.prototype.create = function (dto, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, initialStock, productData;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.product.findFirst({
                                where: {
                                    sku: dto.sku,
                                    isActive: true,
                                },
                            })];
                        case 1:
                            existing = _a.sent();
                            if (existing) {
                                throw new common_1.ConflictException('SKU already exists');
                            }
                            initialStock = dto.initialStock, productData = __rest(dto, ["initialStock"]);
                            // Create product with stock in transaction
                            return [2 /*return*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var product, stock;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, tx.product.create({
                                                    data: __assign(__assign({}, productData), { costPrice: new client_1.Prisma.Decimal(dto.costPrice), sellingPrice: new client_1.Prisma.Decimal(dto.sellingPrice) }),
                                                })];
                                            case 1:
                                                product = _a.sent();
                                                return [4 /*yield*/, tx.stock.create({
                                                        data: {
                                                            productId: product.id,
                                                            quantity: initialStock || 0,
                                                        },
                                                    })];
                                            case 2:
                                                stock = _a.sent();
                                                if (!(initialStock && initialStock > 0)) return [3 /*break*/, 5];
                                                return [4 /*yield*/, tx.stockMovement.create({
                                                        data: {
                                                            productId: product.id,
                                                            type: 'INIT',
                                                            quantity: initialStock,
                                                            balanceAfter: initialStock,
                                                            notes: 'Initial stock',
                                                            performedBy: userId,
                                                        },
                                                    })];
                                            case 3:
                                                _a.sent();
                                                return [4 /*yield*/, tx.stock.update({
                                                        where: { productId: product.id },
                                                        data: { lastMovementAt: new Date() },
                                                    })];
                                            case 4:
                                                _a.sent();
                                                _a.label = 5;
                                            case 5: 
                                            // Return product with stock (from within transaction)
                                            return [2 /*return*/, __assign(__assign({}, product), { stock: stock })];
                                        }
                                    });
                                }); })];
                    }
                });
            });
        };
        ProductsService_1.prototype.findAll = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var search, category, status, _a, page, _b, limit, where, needsStockFilter, products, processedProducts, totalFiltered, paginatedProducts, total, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            search = query.search, category = query.category, status = query.status, _a = query.page, page = _a === void 0 ? 1 : _a, _b = query.limit, limit = _b === void 0 ? 10 : _b;
                            where = {};
                            if (search) {
                                where.OR = [
                                    { name: { contains: search, mode: 'insensitive' } },
                                    { sku: { contains: search, mode: 'insensitive' } },
                                ];
                            }
                            if (category) {
                                where.category = category;
                            }
                            needsStockFilter = status === 'low_stock' || status === 'out_of_stock' || status === 'in_stock';
                            return [4 /*yield*/, this.prisma.product.findMany(__assign(__assign({ where: where, include: {
                                        stock: true,
                                        _count: {
                                            select: { txnItems: true }
                                        }
                                    } }, (needsStockFilter ? {} : { skip: (page - 1) * limit, take: limit })), { orderBy: { updatedAt: 'desc' } }))];
                        case 1:
                            products = _d.sent();
                            processedProducts = products.map(function (p) {
                                var _a, _b;
                                return (__assign(__assign({}, p), { transactionCount: ((_a = p._count) === null || _a === void 0 ? void 0 : _a.txnItems) || 0, canDelete: (((_b = p._count) === null || _b === void 0 ? void 0 : _b.txnItems) || 0) === 0 }));
                            });
                            // Apply stock status filter
                            if (status === 'low_stock') {
                                processedProducts = processedProducts.filter(function (p) { return p.stock && p.stock.quantity > 0 && p.stock.quantity <= p.minStockLevel; });
                            }
                            else if (status === 'out_of_stock') {
                                processedProducts = processedProducts.filter(function (p) { return !p.stock || p.stock.quantity === 0; });
                            }
                            else if (status === 'in_stock') {
                                processedProducts = processedProducts.filter(function (p) { return p.stock && p.stock.quantity > p.minStockLevel; });
                            }
                            totalFiltered = processedProducts.length;
                            paginatedProducts = needsStockFilter
                                ? processedProducts.slice((page - 1) * limit, page * limit)
                                : processedProducts;
                            if (!needsStockFilter) return [3 /*break*/, 2];
                            _c = totalFiltered;
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this.prisma.product.count({ where: where })];
                        case 3:
                            _c = _d.sent();
                            _d.label = 4;
                        case 4:
                            total = _c;
                            return [2 /*return*/, {
                                    data: paginatedProducts,
                                    meta: {
                                        total: total,
                                        page: page,
                                        limit: limit,
                                        totalPages: Math.ceil(total / limit),
                                    },
                                }];
                    }
                });
            });
        };
        ProductsService_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var product;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.product.findUnique({
                                where: { id: id },
                                include: { stock: true },
                            })];
                        case 1:
                            product = _a.sent();
                            if (!product) {
                                throw new common_1.NotFoundException('Product not found');
                            }
                            return [2 /*return*/, product];
                    }
                });
            });
        };
        ProductsService_1.prototype.update = function (id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var existing;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            _a.sent();
                            if (!dto.sku) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.prisma.product.findFirst({
                                    where: { sku: dto.sku, NOT: { id: id } },
                                })];
                        case 2:
                            existing = _a.sent();
                            if (existing) {
                                throw new common_1.ConflictException('SKU already exists');
                            }
                            _a.label = 3;
                        case 3: return [2 /*return*/, this.prisma.product.update({
                                where: { id: id },
                                data: __assign(__assign({}, dto), { costPrice: dto.costPrice ? new client_1.Prisma.Decimal(dto.costPrice) : undefined, sellingPrice: dto.sellingPrice ? new client_1.Prisma.Decimal(dto.sellingPrice) : undefined }),
                                include: { stock: true },
                            })];
                    }
                });
            });
        };
        ProductsService_1.prototype.remove = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var product, transactionCount;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            product = _a.sent();
                            return [4 /*yield*/, this.prisma.transactionItem.count({
                                    where: { productId: id },
                                })];
                        case 2:
                            transactionCount = _a.sent();
                            if (transactionCount > 0) {
                                throw new common_1.ConflictException("Cannot delete product \"".concat(product.name, "\" - it has been used in ").concat(transactionCount, " transaction(s). ") +
                                    "Consider marking it as inactive instead.");
                            }
                            // Hard delete - remove product and related records
                            return [4 /*yield*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: 
                                            // Delete stock movements first
                                            return [4 /*yield*/, tx.stockMovement.deleteMany({
                                                    where: { productId: id },
                                                })];
                                            case 1:
                                                // Delete stock movements first
                                                _a.sent();
                                                // Delete stock record
                                                return [4 /*yield*/, tx.stock.deleteMany({
                                                        where: { productId: id },
                                                    })];
                                            case 2:
                                                // Delete stock record
                                                _a.sent();
                                                // Delete the product
                                                return [4 /*yield*/, tx.product.delete({
                                                        where: { id: id },
                                                    })];
                                            case 3:
                                                // Delete the product
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 3:
                            // Hard delete - remove product and related records
                            _a.sent();
                            return [2 /*return*/, { message: 'Product deleted successfully', sku: product.sku }];
                    }
                });
            });
        };
        ProductsService_1.prototype.getCategories = function () {
            return __awaiter(this, void 0, void 0, function () {
                var categories;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.product.findMany({
                                where: { category: { not: null } },
                                select: { category: true },
                                distinct: ['category'],
                            })];
                        case 1:
                            categories = _a.sent();
                            return [2 /*return*/, categories.map(function (c) { return c.category; }).filter(Boolean)];
                    }
                });
            });
        };
        return ProductsService_1;
    }());
    __setFunctionName(_classThis, "ProductsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProductsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProductsService = _classThis;
}();
exports.ProductsService = ProductsService;
