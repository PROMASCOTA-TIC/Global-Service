import { IsEmail, IsNotEmpty, IsNumber, IsString, IsStrongPassword, MinLength } from "class-validator"

export class CreateUserDto {
    @IsEmail()
    email: string
    @IsStrongPassword()
    password: string
    @IsString()
    @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
    @MinLength(5, { message: 'El nombre debe tener al menos 5 caracteres' })
    name: string;
}
