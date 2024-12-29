import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, MaxLength  } from "class-validator"
import { CreateUserDto } from "./create-user.dto"

export class CreatePetOwnerDto extends CreateUserDto {
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    urlPhoto?: string

    @IsArray()
    @IsString({each: true})
    preferences: string[]

    @IsArray()
    @IsString({each: true})
    petPreferences: string[]

    @IsPhoneNumber()
    phoneNumber: string

    @IsOptional()
    @IsArray()
    @IsString({each: true})
    addresses: string[]
}
