"use strict";
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
exports.InventoryService = exports.StockAdjustmentDto = void 0;
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var class_validator_1 = require("class-validator");
var StockAdjustmentDto = function () {
    var _a;
    var _productId_decorators;
    var _productId_initializers = [];
    var _productId_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _quantity_decorators;
    var _quantity_initializers = [];
    var _quantity_extraInitializers = [];
    var _reason_decorators;
    var _reason_initializers = [];
    var _reason_extraInitializers = [];
    var _notes_decorators;
    var _notes_initializers = [];
    var _notes_extraInitializers = [];
    return _a = /** @class */ (function () {
            function StockAdjustmentDto() {
                this.productId = __runInitializers(this, _productId_initializers, void 0);
                this.type = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.quantity = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _quantity_initializers, void 0));
                this.reason = (__runInitializers(this, _quantity_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                this.notes = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                __runInitializers(this, _notes_extraInitializers);
            }
            return StockAdjustmentDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _productId_decorators = [(0, class_validator_1.IsString)()];
            _type_decorators = [(0, class_validator_1.IsIn)(['add', 'remove', 'set'])];
            _quantity_decorators = [(0, class_validator_1.IsNumber)()];
            _reason_decorators = [(0, class_validator_1.IsString)()];
            _notes_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: function (obj) { return "productId" in obj; }, get: function (obj) { return obj.productId; }, set: function (obj, value) { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _quantity_decorators, { kind: "field", name: "quantity", static: false, private: false, access: { has: function (obj) { return "quantity" in obj; }, get: function (obj) { return obj.quantity; }, set: function (obj, value) { obj.quantity = value; } }, metadata: _metadata }, _quantity_initializers, _quantity_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: function (obj) { return "reason" in obj; }, get: function (obj) { return obj.reason; }, set: function (obj, value) { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: function (obj) { return "notes" in obj; }, get: function (obj) { return obj.notes; }, set: function (obj, value) { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.StockAdjustmentDto = StockAdjustmentDto;
var InventoryService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var InventoryService = _classThis = /** @class */ (function () {
        function InventoryService_1(prisma) {
            this.prisma = prisma;
        }
        InventoryService_1.prototype.findAll = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var search, category, stockStatus, _a, page, _b, limit, where, allProducts, filtered, totalFiltered, paginatedProducts, total, summaryStats;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            search = query.search, category = query.category, stockStatus = query.stockStatus, _a = query.page, page = _a === void 0 ? 1 : _a, _b = query.limit, limit = _b === void 0 ? 10 : _b;
                            where = { isActive: true };
                            if (search) {
                                where.OR = [
                                    { name: { contains: search, mode: 'insensitive' } },
                                    { sku: { contains: search, mode: 'insensitive' } },
                                ];
                            }
                            if (category) {
                                where.category = category;
                            }
                            return [4 /*yield*/, this.prisma.product.findMany({
                                    where: where,
                                    include: { stock: true },
                                    orderBy: { name: 'asc' },
                                })];
                        case 1:
                            allProducts = _c.sent();
                            filtered = allProducts;
                            if (stockStatus === 'in_stock') {
                                filtered = allProducts.filter(function (p) { var _a; return (((_a = p.stock) === null || _a === void 0 ? void 0 : _a.quantity) || 0) > p.minStockLevel; });
                            }
                            else if (stockStatus === 'low_stock') {
                                filtered = allProducts.filter(function (p) { return p.stock && p.stock.quantity > 0 && p.stock.quantity <= p.minStockLevel; });
                            }
                            else if (stockStatus === 'out_of_stock') {
                                filtered = allProducts.filter(function (p) { var _a; return (((_a = p.stock) === null || _a === void 0 ? void 0 : _a.quantity) || 0) === 0; });
                            }
                            totalFiltered = filtered.length;
                            paginatedProducts = filtered.slice((page - 1) * limit, page * limit);
                            total = filtered.length;
                            summaryStats = {
                                totalUnits: filtered.reduce(function (sum, p) { var _a; return sum + (((_a = p.stock) === null || _a === void 0 ? void 0 : _a.quantity) || 0); }, 0),
                                totalValue: filtered.reduce(function (sum, p) { var _a; return sum + (((_a = p.stock) === null || _a === void 0 ? void 0 : _a.quantity) || 0) * Number(p.costPrice || 0); }, 0),
                                lowStockCount: filtered.filter(function (p) { return p.stock && p.stock.quantity <= p.minStockLevel; }).length,
                            };
                            return [2 /*return*/, {
                                    data: paginatedProducts.map(function (p) {
                                        var _a, _b, _c, _d, _e;
                                        return ({
                                            id: p.id,
                                            sku: p.sku,
                                            name: p.name,
                                            category: p.category,
                                            costPrice: Number(p.costPrice) || 0,
                                            quantity: ((_a = p.stock) === null || _a === void 0 ? void 0 : _a.quantity) || 0,
                                            reservedQty: ((_b = p.stock) === null || _b === void 0 ? void 0 : _b.reservedQty) || 0,
                                            available: (((_c = p.stock) === null || _c === void 0 ? void 0 : _c.quantity) || 0) - (((_d = p.stock) === null || _d === void 0 ? void 0 : _d.reservedQty) || 0),
                                            minStockLevel: p.minStockLevel,
                                            isLowStock: p.stock ? p.stock.quantity <= p.minStockLevel : false,
                                            lastMovementAt: (_e = p.stock) === null || _e === void 0 ? void 0 : _e.lastMovementAt,
                                        });
                                    }),
                                    meta: { total: total, page: page, limit: limit, totalPages: Math.ceil(total / limit) },
                                    summary: summaryStats,
                                }];
                    }
                });
            });
        };
        InventoryService_1.prototype.getLowStockAlerts = function () {
            return __awaiter(this, void 0, void 0, function () {
                var products;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.product.findMany({
                                where: { isActive: true },
                                include: { stock: true },
                            })];
                        case 1:
                            products = _a.sent();
                            return [2 /*return*/, products
                                    .filter(function (p) { return p.stock && p.stock.quantity <= p.minStockLevel; })
                                    .map(function (p) {
                                    var _a;
                                    return ({
                                        id: p.id,
                                        sku: p.sku,
                                        name: p.name,
                                        quantity: ((_a = p.stock) === null || _a === void 0 ? void 0 : _a.quantity) || 0,
                                        minStockLevel: p.minStockLevel,
                                        isCritical: p.stock ? p.stock.quantity === 0 : true,
                                    });
                                })];
                    }
                });
            });
        };
        InventoryService_1.prototype.adjustStock = function (dto, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var stock, newQuantity, movementQty;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.stock.findUnique({
                                where: { productId: dto.productId },
                                include: { product: true },
                            })];
                        case 1:
                            stock = _a.sent();
                            if (!stock) {
                                throw new common_1.NotFoundException('Product stock not found');
                            }
                            switch (dto.type) {
                                case 'add':
                                    newQuantity = stock.quantity + dto.quantity;
                                    movementQty = dto.quantity;
                                    break;
                                case 'remove':
                                    if (dto.quantity > stock.quantity) {
                                        throw new common_1.BadRequestException('Cannot remove more than available stock');
                                    }
                                    newQuantity = stock.quantity - dto.quantity;
                                    movementQty = -dto.quantity;
                                    break;
                                case 'set':
                                    movementQty = dto.quantity - stock.quantity;
                                    newQuantity = dto.quantity;
                                    break;
                                default:
                                    throw new common_1.BadRequestException('Invalid adjustment type');
                            }
                            return [2 /*return*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: 
                                            // Update stock
                                            return [4 /*yield*/, tx.stock.update({
                                                    where: { productId: dto.productId },
                                                    data: {
                                                        quantity: newQuantity,
                                                        lastMovementAt: new Date(),
                                                    },
                                                })];
                                            case 1:
                                                // Update stock
                                                _a.sent();
                                                // Create movement record
                                                return [4 /*yield*/, tx.stockMovement.create({
                                                        data: {
                                                            productId: dto.productId,
                                                            type: client_1.StockMovementType.ADJUST,
                                                            quantity: movementQty,
                                                            balanceAfter: newQuantity,
                                                            notes: "".concat(dto.reason).concat(dto.notes ? ': ' + dto.notes : ''),
                                                            performedBy: userId,
                                                        },
                                                    })];
                                            case 2:
                                                // Create movement record
                                                _a.sent();
                                                return [2 /*return*/, {
                                                        productId: dto.productId,
                                                        previousQuantity: stock.quantity,
                                                        newQuantity: newQuantity,
                                                        adjustment: movementQty,
                                                    }];
                                        }
                                    });
                                }); })];
                    }
                });
            });
        };
        InventoryService_1.prototype.getMovements = function (productId_1) {
            return __awaiter(this, arguments, void 0, function (productId, page, limit) {
                var skip, where, movements, total;
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            skip = (page - 1) * limit;
                            where = {};
                            if (productId) {
                                where.productId = productId;
                            }
                            return [4 /*yield*/, this.prisma.stockMovement.findMany({
                                    where: where,
                                    include: {
                                        product: { select: { name: true, sku: true } },
                                        user: { select: { fullName: true } },
                                    },
                                    skip: skip,
                                    take: limit,
                                    orderBy: { createdAt: 'desc' },
                                })];
                        case 1:
                            movements = _a.sent();
                            return [4 /*yield*/, this.prisma.stockMovement.count({ where: where })];
                        case 2:
                            total = _a.sent();
                            return [2 /*return*/, {
                                    data: movements,
                                    meta: { total: total, page: page, limit: limit },
                                }];
                    }
                });
            });
        };
        return InventoryService_1;
    }());
    __setFunctionName(_classThis, "InventoryService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InventoryService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InventoryService = _classThis;
}();
exports.InventoryService = InventoryService;
