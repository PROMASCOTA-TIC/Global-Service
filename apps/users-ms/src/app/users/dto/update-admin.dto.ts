import { PartialType } from '@nestjs/mapped-types';
import { UpdateUserDto } from './update-user.dto';
import { IsUUID } from 'class-validator';

export class UpdateAdminDto extends PartialType(UpdateUserDto) {
    @IsUUID()
    id: string;
}
