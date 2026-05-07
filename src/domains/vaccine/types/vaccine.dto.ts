export interface VaccineCreateDto {
    name: string;
    category: string;
    description: string;
    recommendedAge: string;
    boosterSchedule?: string;
    isActive?: boolean;
}