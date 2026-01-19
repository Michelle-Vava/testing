"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var JobsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jobs_service_1 = require("./jobs.service");
const update_job_status_dto_1 = require("./dto/update-job-status.dto");
const job_response_dto_1 = require("./dto/job-response.dto");
const pagination_dto_1 = require("../../shared/dto/pagination.dto");
let JobsController = JobsController_1 = class JobsController {
    jobsService;
    logger = new common_1.Logger(JobsController_1.name);
    constructor(jobsService) {
        this.jobsService = jobsService;
    }
    async findAll(req, paginationDto) {
        this.logger.log(`User ${req.user.id} fetching all jobs`);
        return this.jobsService.findAll(req.user.id, req.user.roles, paginationDto);
    }
    async findOne(req, id) {
        this.logger.log(`User ${req.user.id} fetching job ${id}`);
        return this.jobsService.findOne(id, req.user.id);
    }
    async updateStatus(req, id, statusData) {
        this.logger.log(`User ${req.user.id} updating job ${id} status to ${statusData.status}`);
        return this.jobsService.updateStatus(id, req.user.id, statusData);
    }
};
exports.JobsController = JobsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all jobs (owners see theirs, providers see theirs)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 20, max: 100)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Paginated list of jobs',
        type: [job_response_dto_1.JobResponseDto]
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific job by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Job details', type: job_response_dto_1.JobResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Job not found.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update job status (providers only)' }),
    (0, swagger_1.ApiBody)({ type: update_job_status_dto_1.UpdateJobStatusDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Job status updated successfully', type: job_response_dto_1.JobResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Job not found.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_job_status_dto_1.UpdateJobStatusDto]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "updateStatus", null);
exports.JobsController = JobsController = JobsController_1 = __decorate([
    (0, swagger_1.ApiTags)('jobs'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('jobs'),
    __metadata("design:paramtypes", [jobs_service_1.JobsService])
], JobsController);
//# sourceMappingURL=jobs.controller.js.map