export interface UserOutDto {
    id: number;
    fullName: string;
    email: string;
    phone?: string;
    role: "GUARDIAN" | "STAFF" | "ADMIN";
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
}

export interface ForgotPasswordDto {
    email: string;
}

export interface ResetPasswordDto {
    token: string;
    password: string;
}