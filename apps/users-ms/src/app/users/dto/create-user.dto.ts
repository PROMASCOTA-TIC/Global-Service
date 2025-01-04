import { IsEmail, IsOptional, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator"

export class CreateUserDto {
    @IsEmail()
    email: string

    @IsStrongPassword()
    password: string

    @IsString()
    name: string

    @IsString()
    @IsOptional()
    @MinLength(1)
    @MaxLength(1)
    isEntrepreneur?: string

    @IsString()
    @MinLength(1)
    @MaxLength(1)
    @IsOptional()
    isPetOwner?: string

    @IsString()
    @MinLength(1)
    @MaxLength(1)
    @IsOptional()
    isAdmin?: string
}
