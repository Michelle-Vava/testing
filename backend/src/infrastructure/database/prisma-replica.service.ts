import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

/**
 * Extended Prisma Service with Read Replica Support
 * 
 * Splits read and write operations across primary and replica databases
 * for improved performance and scalability.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readReplica: PrismaClient | null = null;

  constructor(private configService: ConfigService) {
    super();
    
    // Initialize read replica if URL is provided
    const replicaUrl = this.configService.get<string>('DATABASE_REPLICA_URL');
    if (replicaUrl) {
      this.readReplica = new PrismaClient({
        datasources: {
          db: {
            url: replicaUrl,
          },
        },
      });
      this.logger.log('Read replica configured');
    }
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma connected to primary database');
    
    if (this.readReplica) {
      await this.readReplica.$connect();
      this.logger.log('Prisma connected to read replica');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    if (this.readReplica) {
      await this.readReplica.$disconnect();
    }
  }

  /**
   * Get client for read operations (uses replica if available)
   */
  get read(): PrismaClient {
    return this.readReplica || this;
  }

  /**
   * Get client for write operations (always uses primary)
   */
  get write(): PrismaClient {
    return this;
  }
}
