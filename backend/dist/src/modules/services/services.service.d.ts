import { PrismaService } from '../../infrastructure/database/prisma.service';
export declare class ServicesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        description: string | null;
        slug: string;
        icon: string | null;
        isPopular: boolean;
        isActive: boolean;
        displayOrder: number;
    }[]>;
    findPopular(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        description: string | null;
        slug: string;
        icon: string | null;
        isPopular: boolean;
        isActive: boolean;
        displayOrder: number;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        description: string | null;
        slug: string;
        icon: string | null;
        isPopular: boolean;
        isActive: boolean;
        displayOrder: number;
    } | null>;
}
