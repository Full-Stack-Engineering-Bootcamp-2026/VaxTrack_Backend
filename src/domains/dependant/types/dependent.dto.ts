import { Gender, Relationship } from "../entities/dependent.entity";

export interface CreateDependentDto {
    fullName: string;
    dateOfBirth: Date;
    gender: Gender;
    relationship: Relationship;
    notes: string;
}

export interface UpdateDependentDto {
    fullName?: string;
    dateOfBirth?: Date;
    gender?: Gender;
    relationship?: Relationship;
    notes?: string;
}

export interface DependentOutDto {
    id: number;
    fullName: string;
    dateOfBirth: Date;
    gender: Gender;
    relationship: Relationship;
    notes: string;
    isActive: boolean;
    createdAt: Date;
}