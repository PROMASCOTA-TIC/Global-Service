import { IsEmail, IsNotEmpty, IsNumber, IsString, IsStrongPassword, MinLength } from "class-validator"

export class CreateUserDto {
    @IsEmail()
    email: string
    @IsStrongPassword()
    password: string
}
