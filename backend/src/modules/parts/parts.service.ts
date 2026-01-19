import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { PartCondition } from '@prisma/client';

@Injectable()
export class PartsService {
  constructor(private prisma: PrismaService) {}

  async create(providerId: string, dto: {
    name: string;
    category?: string;
    condition: string;
    price: number;
    notes?: string;
  }) {
    return this.prisma.partInventory.create({
      data: {
        providerId,
        name: dto.name,
        category: dto.category,
        condition: dto.condition as PartCondition,
        price: dto.price,
        notes: dto.notes,
      },
    });
  }

  async findByProvider(providerId: string) {
    return this.prisma.partInventory.findMany({
      where: { providerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(providerId: string, partId: string) {
    const part = await this.prisma.partInventory.findUnique({
      where: { id: partId },
    });

    if (!part) {
      throw new NotFoundException('Part not found');
    }

    if (part.providerId !== providerId) {
      throw new ForbiddenException('You do not own this part listing');
    }

    return this.prisma.partInventory.delete({
      where: { id: partId },
    });
  }
}
