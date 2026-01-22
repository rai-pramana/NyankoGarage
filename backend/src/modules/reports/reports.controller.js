"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var ReportsController = function () {
    var _classDecorators = [(0, common_1.Controller)('reports'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getSalesReport_decorators;
    var _getInventoryReport_decorators;
    var _getPurchaseReport_decorators;
    var _getProfitReport_decorators;
    var _getActivityLog_decorators;
    var ReportsController = _classThis = /** @class */ (function () {
        function ReportsController_1(reportsService) {
            this.reportsService = (__runInitializers(this, _instanceExtraInitializers), reportsService);
        }
        ReportsController_1.prototype.getSalesReport = function (startDate, endDate) {
            return this.reportsService.getSalesReport(startDate, endDate);
        };
        ReportsController_1.prototype.getInventoryReport = function () {
            return this.reportsService.getInventoryReport();
        };
        ReportsController_1.prototype.getPurchaseReport = function (startDate, endDate) {
            return this.reportsService.getPurchaseReport(startDate, endDate);
        };
        ReportsController_1.prototype.getProfitReport = function (startDate, endDate) {
            return this.reportsService.getProfitReport(startDate, endDate);
        };
        ReportsController_1.prototype.getActivityLog = function (limit) {
            return this.reportsService.getActivityLog(limit ? Number(limit) : undefined);
        };
        return ReportsController_1;
    }());
    __setFunctionName(_classThis, "ReportsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getSalesReport_decorators = [(0, common_1.Get)('sales')];
        _getInventoryReport_decorators = [(0, common_1.Get)('inventory')];
        _getPurchaseReport_decorators = [(0, common_1.Get)('purchases')];
        _getProfitReport_decorators = [(0, common_1.Get)('profit')];
        _getActivityLog_decorators = [(0, common_1.Get)('activity')];
        __esDecorate(_classThis, null, _getSalesReport_decorators, { kind: "method", name: "getSalesReport", static: false, private: false, access: { has: function (obj) { return "getSalesReport" in obj; }, get: function (obj) { return obj.getSalesReport; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getInventoryReport_decorators, { kind: "method", name: "getInventoryReport", static: false, private: false, access: { has: function (obj) { return "getInventoryReport" in obj; }, get: function (obj) { return obj.getInventoryReport; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPurchaseReport_decorators, { kind: "method", name: "getPurchaseReport", static: false, private: false, access: { has: function (obj) { return "getPurchaseReport" in obj; }, get: function (obj) { return obj.getPurchaseReport; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getProfitReport_decorators, { kind: "method", name: "getProfitReport", static: false, private: false, access: { has: function (obj) { return "getProfitReport" in obj; }, get: function (obj) { return obj.getProfitReport; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getActivityLog_decorators, { kind: "method", name: "getActivityLog", static: false, private: false, access: { has: function (obj) { return "getActivityLog" in obj; }, get: function (obj) { return obj.getActivityLog; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReportsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReportsController = _classThis;
}();
exports.ReportsController = ReportsController;
