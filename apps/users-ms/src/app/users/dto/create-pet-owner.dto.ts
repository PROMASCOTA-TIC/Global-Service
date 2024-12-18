import { IsArray, IsNotEmpty, IsNumber, IsPhoneNumber, IsString, MaxLength  } from "class-validator"
import { CreateUserDto } from "./create-user.dto"

export class CreatePetOwnerDto extends CreateUserDto {
    @IsString()
    name: string

    @IsString()
    urlPhoto: string

    @IsArray()
    @IsString({each: true})
    preferences: string[]

    @IsArray()
    @IsString({each: true})
    petPreferences: string[]

    @IsPhoneNumber()
    phoneNumber: string

    @IsArray()
    @IsString({each: true})
    address: string[]
}
