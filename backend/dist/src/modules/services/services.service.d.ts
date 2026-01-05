import { PrismaService } from '../../infrastructure/database/prisma.service';
export declare class ServicesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        icon: string | null;
        isPopular: boolean;
        isActive: boolean;
        displayOrder: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findPopular(): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        icon: string | null;
        isPopular: boolean;
        isActive: boolean;
        displayOrder: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        icon: string | null;
        isPopular: boolean;
        isActive: boolean;
        displayOrder: number;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
}
