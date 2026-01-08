"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
let AllExceptionsFilter = class AllExceptionsFilter {
    logger = new common_1.Logger('ErrorHandler');
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception instanceof common_1.HttpException
            ? exception.getResponse()
            : 'Internal server error';
        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message: typeof message === 'string' ? message : message.message || message,
            error: typeof message === 'object' ? message.error : undefined,
        };
        if (process.env.NODE_ENV === 'production' && status === common_1.HttpStatus.INTERNAL_SERVER_ERROR) {
            errorResponse.message = 'Internal server error';
            errorResponse.error = undefined;
        }
        const reset = '\x1b[0m';
        const red = '\x1b[31m';
        const yellow = '\x1b[33m';
        const cyan = '\x1b[36m';
        const methodColor = '\x1b[34m';
        if (status === common_1.HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(`${red}[${status}]${reset} ${methodColor}${request.method}${reset} ${cyan}${request.url}${reset}`, exception instanceof Error ? exception.stack : 'Unknown error');
        }
        else {
            const errorMsg = typeof errorResponse.message === 'object'
                ? JSON.stringify(errorResponse.message)
                : errorResponse.message;
            response.locals = response.locals || {};
            response.locals.errorMessage = errorMsg;
        }
        response.status(status).json(errorResponse);
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
//# sourceMappingURL=http-exception.filter.js.map