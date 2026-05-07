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