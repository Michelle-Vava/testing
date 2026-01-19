"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.envValidationSchema = void 0;
const Joi = __importStar(require("joi"));
exports.envValidationSchema = Joi.object({
    PORT: Joi.number().default(4201),
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),
    FRONTEND_URL: Joi.string().uri().required(),
    DATABASE_URL: Joi.string().required(),
    SUPABASE_URL: Joi.string().uri().optional(),
    SUPABASE_ANON_KEY: Joi.string().optional(),
    CLERK_SECRET_KEY: Joi.string().required(),
    CLERK_PUBLISHABLE_KEY: Joi.string().required(),
    CLERK_WEBHOOK_SECRET: Joi.string().optional(),
    CLERK_JWT_KEY: Joi.string().optional(),
    JWT_SECRET: Joi.string().optional(),
    STRIPE_SECRET_KEY: Joi.string().required(),
    CLOUDINARY_CLOUD_NAME: Joi.string().required(),
    CLOUDINARY_API_KEY: Joi.string().required(),
    CLOUDINARY_API_SECRET: Joi.string().required(),
    RESEND_API_KEY: Joi.string().required(),
    EMAIL_FROM: Joi.string().email().default('onboarding@resend.dev'),
    REDIS_HOST: Joi.string().default('localhost'),
    REDIS_PORT: Joi.number().default(6379),
});
//# sourceMappingURL=env.validation.js.map