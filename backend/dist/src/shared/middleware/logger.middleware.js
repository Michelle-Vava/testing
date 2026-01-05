"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerMiddleware = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let LoggerMiddleware = class LoggerMiddleware {
    logger = new common_1.Logger('HTTP');
    use(req, res, next) {
        const { method, originalUrl } = req;
        const startTime = Date.now();
        const requestId = req.headers['x-request-id'] || (0, crypto_1.randomUUID)();
        const shortId = requestId.slice(0, 8);
        res.setHeader('X-Request-ID', requestId);
        res.on('finish', () => {
            const { statusCode } = res;
            const duration = Date.now() - startTime;
            const errorMessage = res.locals?.errorMessage;
            const user = req.user;
            const userLabel = user?.email ? `[${user.email}]` : '[Guest]';
            const traceId = user?.id ? String(user.id).slice(0, 8) : shortId;
            const color = statusCode >= 500 ? '\x1b[31m' :
                statusCode >= 400 ? '\x1b[33m' :
                    statusCode >= 300 ? '\x1b[36m' :
                        '\x1b[32m';
            const reset = '\x1b[0m';
            const methodColor = '\x1b[34m';
            const dim = '\x1b[2m';
            const errorPart = errorMessage ? ` - ${'\x1b[31m'}${errorMessage}${reset}` : '';
            this.logger.log(`${dim}[${traceId}]${reset} ${userLabel} ${methodColor}${method}${reset} ${originalUrl} ${color}${statusCode}${reset} +${duration}ms${errorPart}`);
        });
        next();
    }
};
exports.LoggerMiddleware = LoggerMiddleware;
exports.LoggerMiddleware = LoggerMiddleware = __decorate([
    (0, common_1.Injectable)()
], LoggerMiddleware);
//# sourceMappingURL=logger.middleware.js.map