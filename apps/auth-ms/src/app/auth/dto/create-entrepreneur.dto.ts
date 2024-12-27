import { IsString, IsEmail, IsArray, IsOptional, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class HorarioDto {
  @IsString()
  dia: string;

  @IsOptional()
  @IsString()
  horaApertura?: string;

  @IsOptional()
  @IsString()
  horaCierre?: string;

  @IsEnum(['1', '0'])
  cerrado: '1' | '0';
}

export class CreateEntrepreneurDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsEnum(['1', '0'])
  isEntrepreneur: '1' | '0';

  @IsString()
  nombreEmprendimiento: string;

  @IsString()
  ruc: string;

  @IsString()
  numeroCelular: string;

  @IsString()
  bancoNombre: string;

  @IsEnum(['Ahorros', 'Corriente'])
  bancoTipoCuenta: 'Ahorros' | 'Corriente';

  @IsString()
  bancoNumeroCuenta: string;

  @IsString()
  bancoNombreDuenoCuenta: string;

  @IsEnum(['1', '0'])
  realizaEnvios: '1' | '0';

  @IsEnum(['1', '0'])
  soloRetiraEnTienda: '1' | '0';

  @IsString()
  direccionLocal: string;

  @IsString()
  sectorLocal: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HorarioDto)
  horario: HorarioDto[];

  @IsArray()
  fotosLocal: string[];

  @IsArray()
  fotosLogotipo: string[];

  @IsEnum(['1', '0'])
  aceptoTerminos: '1' | '0';
}
