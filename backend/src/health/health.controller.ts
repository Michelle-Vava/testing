import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../infrastructure/database/prisma.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly db: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  async check() {
    const timestamp = new Date().toISOString();
    
    try {
      // Simple database query to verify connection
      await this.db.$queryRaw`SELECT 1`;
      
      return {
        status: 'ok',
        timestamp,
        database: 'connected',
        version: process.env.npm_package_version || '1.0.0',
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp,
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
        version: process.env.npm_package_version || '1.0.0',
      };
    }
  }
}
