import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  async findByUserId(userId: string, limit = 10) {
    return this.prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async create(userId: string, type: string, description: string, metadata?: any) {
    return this.prisma.activity.create({
      data: {
        userId,
        type,
        description,
        metadata,
      },
    });
  }
}
