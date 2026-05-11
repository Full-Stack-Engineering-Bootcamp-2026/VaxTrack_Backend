export interface RecordVaccinationDto {
    administeredDate: Date;
    batchNumber: string;
    clinicalNotes?: string;
}

export interface UpdateVaccinationDto {
    administeredDate?: Date;
    batchNumber?: string;
    clinicalNotes?: string;
}

export interface VaccinationRecordOutDto {
    id: number;
    dueDate: Date;
    administeredDate?: Date;
    batchNumber?: string;
    clinicalNotes?: string;
    status: string;
    createdAt: Date;
}

export interface ComplianceDto {
    compliancePercentage: number;
}

export interface StatusBreakdownDto {
    completed: number;
    upcoming: number;
    overdue: number;
}