import {
    IsString,
    IsEnum,
    IsOptional,
    IsNumber,
    Min,
    Max,
    IsNotEmpty,
    ValidateIf,
  } from 'class-validator';
  
  export class UpdateStatusAndCommissionDTO {
    @IsNotEmpty({ message: 'El estado es obligatorio' })
    @IsEnum(['PENDING', 'APPROVED', 'REJECTED'], {
      message: 'El estado debe ser PENDING, APPROVED o REJECTED',
    })
    estado: 'PENDING' | 'APPROVED' | 'REJECTED';
  
    @ValidateIf((obj) => obj.estado === 'APPROVED')
    @IsNumber({}, { message: 'La comisión debe ser un número válido' })
    @Min(0, { message: 'La comisión no puede ser menor a 0' })
    @Max(100, { message: 'La comisión no puede ser mayor a 100' })
    comision?: number;
  }
  