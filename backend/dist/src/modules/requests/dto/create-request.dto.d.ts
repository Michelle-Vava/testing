export declare enum RequestUrgency {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent"
}
export declare class CreateRequestDto {
    vehicleId: string;
    title: string;
    description: string;
    urgency: RequestUrgency;
}
