import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.service.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async findPopular() {
    return this.prisma.service.findMany({
      where: {
        isActive: true,
        isPopular: true,
      },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.service.findUnique({
      where: { id },
    });
  }
}

