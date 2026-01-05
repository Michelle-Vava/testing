import { ServicesService } from './services.service';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
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
