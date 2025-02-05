
import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { CreateEntrepreneurDTO } from './create-entrepreneur.dto';

class HorarioDTO {
  @IsString({ message: 'El día debe ser un string válido' })
  dia: string;

  @IsOptional()
  @IsString({ message: 'La hora de apertura debe ser un string' })
  horaApertura?: string;

  @IsOptional()
  @IsString({ message: 'La hora de cierre debe ser un string' })
  horaCierre?: string;

  @IsOptional()
  @IsEnum(['1', '0'], { message: 'Cerrado debe ser "1" (true) o "0" (false)' })
  cerrado?: '1' | '0';
}

export class UpdateEntrepreneurDTO extends PartialType(CreateEntrepreneurDTO) {
  @IsOptional()
  @IsString()
  idEntrepreneur?: string;
}
