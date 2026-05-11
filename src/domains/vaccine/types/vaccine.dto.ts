export interface VaccineCreateDto {
    name: string;
    category: string;
    description: string;
    recommendedAgeInDays: number;
    boosterSchedule?: string;
    isActive?: boolean;
}