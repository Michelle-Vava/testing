export declare class VehicleResponseDto {
    id: string;
    ownerId: string;
    make: string;
    model: string;
    year: number;
    vin: string;
    licensePlate: string | null;
    mileage: number | null;
    imageUrls?: string[];
    createdAt: Date;
    updatedAt: Date;
}
