import { IsEmail, IsNotEmpty, IsNumber, IsStrongPassword } from "class-validator"

export class CreateUserDto {
    @IsEmail()
    email: string
    @IsStrongPassword()
    password: string
}
