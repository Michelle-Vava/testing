import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

export interface AuditLogData {
  userId?: string;
  entityType: string;
  entityId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'SOFT_DELETE';
  changes?: Record<string, any>;
  metadata?: Record<string, any>;
}

/**
 * AuditService tracks all changes to critical entities
 * 
 * Provides comprehensive audit trail for compliance and debugging.
 * Logs all CREATE, UPDATE, DELETE, and SOFT_DELETE operations.
 */
@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Create an audit log entry
   */
  async log(data: AuditLogData): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: data.userId,
          entityType: data.entityType,
          entityId: data.entityId,
          action: data.action,
          changes: data.changes || {},
          metadata: data.metadata || {},
        },
      });

      this.logger.log(
        `Audit: ${data.action} ${data.entityType}:${data.entityId} by user:${data.userId || 'system'}`
      );
    } catch (error) {
      this.logger.error('Failed to create audit log', error);
      // Don't throw - audit failures shouldn't break the app
    }
  }

  /**
   * Get audit history for an entity
   */
  async getHistory(entityType: string, entityId: string) {
    return this.prisma.auditLog.findMany({
      where: { entityType, entityId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get user's activity history
   */
  async getUserActivity(userId: string, limit = 50) {
    return this.prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
