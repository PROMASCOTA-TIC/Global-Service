import {
  IsString,
  IsArray,
  IsOptional,
  IsEnum,
  MinLength,
  IsNumber,
  Min,
  Max,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';

export class CreateEntrepreneurDTO extends CreateUserDto {
  @IsString()
  @MinLength(5, { message: 'El nombre debe tener al menos 5 caracteres' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  name: string;

  @IsString()
  nombreEmprendimiento: string;

  @IsString()
  ruc: string;

  @IsString()
  numeroCelular: string;

  @IsString()
  bancoNombre: string;

  @IsEnum(['Ahorros', 'Corriente'], {
    message: 'El tipo de cuenta debe ser Ahorros o Corriente',
  })
  bancoTipoCuenta: 'Ahorros' | 'Corriente';

  @IsString()
  bancoNumeroCuenta: string;

  @IsString()
  bancoNombreDuenoCuenta: string;

  @IsEnum(['1', '0'], { message: 'realizaEnvios debe ser "1" (true) o "0" (false)' })
  realizaEnvios: '1' | '0';

  @IsEnum(['1', '0'], { message: 'soloRetiraEnTienda debe ser "1" (true) o "0" (false)' })
  soloRetiraEnTienda: '1' | '0';

  @IsString()
  @IsNotEmpty({ message: 'La calle principal no puede estar vacía' })
  callePrincipal: string;

  @IsString()
  @IsNotEmpty({ message: 'La calle secundaria no puede estar vacía' })
  calleSecundaria: string;

  @IsString()
  @IsNotEmpty({ message: 'La numeración no puede estar vacía' })
  numeracion: string;

  @IsString()
  @IsNotEmpty({ message: 'La referencia no puede estar vacía' })
  referencia: string;

  @IsString()
  sectorLocal: string;

  @IsArray({ message: 'El horario debe ser un arreglo de objetos' })
  @ValidateNested({ each: true })
  @Type(() => HorarioDTO)
  horario: HorarioDTO[];

  @IsArray({ message: 'fotosLocal debe ser un arreglo de strings' })
  @IsString({ each: true })
  fotosLocal?: string;

  @IsArray({ message: 'fotosLogotipo debe ser un arreglo de strings' })
  @IsString({ each: true })
  fotosLogotipo?: string;

  @IsEnum(['1', '0'], { message: 'aceptoTerminos debe ser "1" (true) o "0" (false)' })
  aceptoTerminos: '1' | '0';

  @IsOptional()
  @IsNumber({}, { message: 'La comisión debe ser un número válido' })
  @Min(0, { message: 'La comisión no puede ser menor a 0' })
  @Max(100, { message: 'La comisión no puede ser mayor a 100' })
  comision?: number;
}

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
