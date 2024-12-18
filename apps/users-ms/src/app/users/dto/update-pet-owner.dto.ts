import { PartialType } from '@nestjs/mapped-types';
import { CreatePetOwnerDto } from './create-pet-owner.dto';
import { IsUUID } from 'class-validator';

export class UpdatePetOwnerDto extends PartialType(CreatePetOwnerDto) {
    @IsUUID()
    id: string;
}
