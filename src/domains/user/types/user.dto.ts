import { UserRole } from "../entities/user.entity";

export interface UserOutDto {
    id: number;
    fullName: string;
    email: string;
    phone?: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    imageUrl?: string;
}

export interface UserCreateDto {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
}

export interface UserLoginDto {
    email: string
    password: string
}

export interface LoginResponseDto {
    accessToken: string;
    tokenType: string;
    user: UserOutDto;
}

export interface ForgotPasswordDto {
    email: string;
}

export interface ResetPasswordDto {
    token: string;
    password: string;
}

export interface UpdateProfileDto {
    fullName?: string;
    phone?: string;
    imageUrl?: string;
}

export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}

export interface CreateStaffDto {
    fullName: string;
    email: string;
    phone: string;
}

export interface UploadResponseDto {
    imageUrl: string;
    fileName: string;
}

export interface DeleteFileDto {
    fileName: string;
}

export interface PaginationDto {
    page?: number;
    limit?: number;
}