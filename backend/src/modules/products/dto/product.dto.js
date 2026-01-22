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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductQueryDto = exports.UpdateProductDto = exports.CreateProductDto = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var CreateProductDto = function () {
    var _a;
    var _sku_decorators;
    var _sku_initializers = [];
    var _sku_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _category_decorators;
    var _category_initializers = [];
    var _category_extraInitializers = [];
    var _unit_decorators;
    var _unit_initializers = [];
    var _unit_extraInitializers = [];
    var _costPrice_decorators;
    var _costPrice_initializers = [];
    var _costPrice_extraInitializers = [];
    var _sellingPrice_decorators;
    var _sellingPrice_initializers = [];
    var _sellingPrice_extraInitializers = [];
    var _minStockLevel_decorators;
    var _minStockLevel_initializers = [];
    var _minStockLevel_extraInitializers = [];
    var _initialStock_decorators;
    var _initialStock_initializers = [];
    var _initialStock_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateProductDto() {
                this.sku = __runInitializers(this, _sku_initializers, void 0);
                this.name = (__runInitializers(this, _sku_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.category = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.unit = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _unit_initializers, void 0));
                this.costPrice = (__runInitializers(this, _unit_extraInitializers), __runInitializers(this, _costPrice_initializers, void 0));
                this.sellingPrice = (__runInitializers(this, _costPrice_extraInitializers), __runInitializers(this, _sellingPrice_initializers, void 0));
                this.minStockLevel = (__runInitializers(this, _sellingPrice_extraInitializers), __runInitializers(this, _minStockLevel_initializers, void 0));
                this.initialStock = (__runInitializers(this, _minStockLevel_extraInitializers), __runInitializers(this, _initialStock_initializers, void 0));
                __runInitializers(this, _initialStock_extraInitializers);
            }
            return CreateProductDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _sku_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _description_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _category_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _unit_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _costPrice_decorators = [(0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _sellingPrice_decorators = [(0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _minStockLevel_decorators = [(0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Min)(0)];
            _initialStock_decorators = [(0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Min)(0)];
            __esDecorate(null, null, _sku_decorators, { kind: "field", name: "sku", static: false, private: false, access: { has: function (obj) { return "sku" in obj; }, get: function (obj) { return obj.sku; }, set: function (obj, value) { obj.sku = value; } }, metadata: _metadata }, _sku_initializers, _sku_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: function (obj) { return "category" in obj; }, get: function (obj) { return obj.category; }, set: function (obj, value) { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _unit_decorators, { kind: "field", name: "unit", static: false, private: false, access: { has: function (obj) { return "unit" in obj; }, get: function (obj) { return obj.unit; }, set: function (obj, value) { obj.unit = value; } }, metadata: _metadata }, _unit_initializers, _unit_extraInitializers);
            __esDecorate(null, null, _costPrice_decorators, { kind: "field", name: "costPrice", static: false, private: false, access: { has: function (obj) { return "costPrice" in obj; }, get: function (obj) { return obj.costPrice; }, set: function (obj, value) { obj.costPrice = value; } }, metadata: _metadata }, _costPrice_initializers, _costPrice_extraInitializers);
            __esDecorate(null, null, _sellingPrice_decorators, { kind: "field", name: "sellingPrice", static: false, private: false, access: { has: function (obj) { return "sellingPrice" in obj; }, get: function (obj) { return obj.sellingPrice; }, set: function (obj, value) { obj.sellingPrice = value; } }, metadata: _metadata }, _sellingPrice_initializers, _sellingPrice_extraInitializers);
            __esDecorate(null, null, _minStockLevel_decorators, { kind: "field", name: "minStockLevel", static: false, private: false, access: { has: function (obj) { return "minStockLevel" in obj; }, get: function (obj) { return obj.minStockLevel; }, set: function (obj, value) { obj.minStockLevel = value; } }, metadata: _metadata }, _minStockLevel_initializers, _minStockLevel_extraInitializers);
            __esDecorate(null, null, _initialStock_decorators, { kind: "field", name: "initialStock", static: false, private: false, access: { has: function (obj) { return "initialStock" in obj; }, get: function (obj) { return obj.initialStock; }, set: function (obj, value) { obj.initialStock = value; } }, metadata: _metadata }, _initialStock_initializers, _initialStock_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateProductDto = CreateProductDto;
var UpdateProductDto = function () {
    var _a;
    var _sku_decorators;
    var _sku_initializers = [];
    var _sku_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _category_decorators;
    var _category_initializers = [];
    var _category_extraInitializers = [];
    var _unit_decorators;
    var _unit_initializers = [];
    var _unit_extraInitializers = [];
    var _costPrice_decorators;
    var _costPrice_initializers = [];
    var _costPrice_extraInitializers = [];
    var _sellingPrice_decorators;
    var _sellingPrice_initializers = [];
    var _sellingPrice_extraInitializers = [];
    var _minStockLevel_decorators;
    var _minStockLevel_initializers = [];
    var _minStockLevel_extraInitializers = [];
    var _isActive_decorators;
    var _isActive_initializers = [];
    var _isActive_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateProductDto() {
                this.sku = __runInitializers(this, _sku_initializers, void 0);
                this.name = (__runInitializers(this, _sku_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.category = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.unit = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _unit_initializers, void 0));
                this.costPrice = (__runInitializers(this, _unit_extraInitializers), __runInitializers(this, _costPrice_initializers, void 0));
                this.sellingPrice = (__runInitializers(this, _costPrice_extraInitializers), __runInitializers(this, _sellingPrice_initializers, void 0));
                this.minStockLevel = (__runInitializers(this, _sellingPrice_extraInitializers), __runInitializers(this, _minStockLevel_initializers, void 0));
                this.isActive = (__runInitializers(this, _minStockLevel_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
                __runInitializers(this, _isActive_extraInitializers);
            }
            return UpdateProductDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _sku_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _description_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _category_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _unit_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _costPrice_decorators = [(0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Min)(0)];
            _sellingPrice_decorators = [(0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Min)(0)];
            _minStockLevel_decorators = [(0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Min)(0)];
            _isActive_decorators = [(0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _sku_decorators, { kind: "field", name: "sku", static: false, private: false, access: { has: function (obj) { return "sku" in obj; }, get: function (obj) { return obj.sku; }, set: function (obj, value) { obj.sku = value; } }, metadata: _metadata }, _sku_initializers, _sku_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: function (obj) { return "category" in obj; }, get: function (obj) { return obj.category; }, set: function (obj, value) { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _unit_decorators, { kind: "field", name: "unit", static: false, private: false, access: { has: function (obj) { return "unit" in obj; }, get: function (obj) { return obj.unit; }, set: function (obj, value) { obj.unit = value; } }, metadata: _metadata }, _unit_initializers, _unit_extraInitializers);
            __esDecorate(null, null, _costPrice_decorators, { kind: "field", name: "costPrice", static: false, private: false, access: { has: function (obj) { return "costPrice" in obj; }, get: function (obj) { return obj.costPrice; }, set: function (obj, value) { obj.costPrice = value; } }, metadata: _metadata }, _costPrice_initializers, _costPrice_extraInitializers);
            __esDecorate(null, null, _sellingPrice_decorators, { kind: "field", name: "sellingPrice", static: false, private: false, access: { has: function (obj) { return "sellingPrice" in obj; }, get: function (obj) { return obj.sellingPrice; }, set: function (obj, value) { obj.sellingPrice = value; } }, metadata: _metadata }, _sellingPrice_initializers, _sellingPrice_extraInitializers);
            __esDecorate(null, null, _minStockLevel_decorators, { kind: "field", name: "minStockLevel", static: false, private: false, access: { has: function (obj) { return "minStockLevel" in obj; }, get: function (obj) { return obj.minStockLevel; }, set: function (obj, value) { obj.minStockLevel = value; } }, metadata: _metadata }, _minStockLevel_initializers, _minStockLevel_extraInitializers);
            __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: function (obj) { return "isActive" in obj; }, get: function (obj) { return obj.isActive; }, set: function (obj, value) { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateProductDto = UpdateProductDto;
var ProductQueryDto = function () {
    var _a;
    var _search_decorators;
    var _search_initializers = [];
    var _search_extraInitializers = [];
    var _category_decorators;
    var _category_initializers = [];
    var _category_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _page_decorators;
    var _page_initializers = [];
    var _page_extraInitializers = [];
    var _limit_decorators;
    var _limit_initializers = [];
    var _limit_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ProductQueryDto() {
                this.search = __runInitializers(this, _search_initializers, void 0);
                this.category = (__runInitializers(this, _search_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.status = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.page = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _page_initializers, 1));
                this.limit = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _limit_initializers, 10));
                __runInitializers(this, _limit_extraInitializers);
            }
            return ProductQueryDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _search_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _category_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _status_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _page_decorators = [(0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _limit_decorators = [(0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _search_decorators, { kind: "field", name: "search", static: false, private: false, access: { has: function (obj) { return "search" in obj; }, get: function (obj) { return obj.search; }, set: function (obj, value) { obj.search = value; } }, metadata: _metadata }, _search_initializers, _search_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: function (obj) { return "category" in obj; }, get: function (obj) { return obj.category; }, set: function (obj, value) { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: function (obj) { return "page" in obj; }, get: function (obj) { return obj.page; }, set: function (obj, value) { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: function (obj) { return "limit" in obj; }, get: function (obj) { return obj.limit; }, set: function (obj, value) { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ProductQueryDto = ProductQueryDto;
