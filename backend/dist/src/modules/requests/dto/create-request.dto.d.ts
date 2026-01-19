export declare enum RequestUrgency {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent"
}
export declare class CreateRequestDto {
    vehicleId?: string;
    make?: string;
    model?: string;
    year?: number;
    title: string;
    description: string;
    urgency: RequestUrgency;
}
