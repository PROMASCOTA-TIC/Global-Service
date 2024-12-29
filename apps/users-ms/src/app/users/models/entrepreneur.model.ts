import {
  Table,
  Column,
  DataType,
  AllowNull,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({
  tableName: 'ENTREPRENEURS',
  paranoid: true,
})
export class Entrepreneur extends Model {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4,
    field: 'ENTREPRENEUR_ID',
  })
  id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'USER_ID'
  })
  userId: string

  @BelongsTo(() => User)
  user: User

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'NOMBRE_EMPRENDIMIENTO',
  })
  nombreEmprendimiento!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(13),
    allowNull: false,
    field: 'RUC',
  })
  ruc!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(15),
    allowNull: false,
    field: 'NUMERO_CELULAR',
  })
  numeroCelular!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'BANCO_NOMBRE',
  })
  bancoNombre!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'BANCO_TIPO_CUENTA',
  })
  bancoTipoCuenta!: 'Ahorros' | 'Corriente';

  @AllowNull(false)
  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    field: 'BANCO_NUMERO_CUENTA',
  })
  bancoNumeroCuenta!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'BANCO_NOMBRE_DUENO_CUENTA',
  })
  bancoNombreDuenoCuenta!: string;

  // Manejo de booleanos nativos en la aplicación
  @AllowNull(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false, // Falso por defecto
    field: 'REALIZA_ENVIOS',
  })
  realizaEnvios!: boolean;

  @AllowNull(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false, // Falso por defecto
    field: 'SOLO_RETIRA_EN_TIENDA',
  })
  soloRetiraEnTienda!: boolean;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'DIRECCION_LOCAL',
  })
  direccionLocal!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'SECTOR_LOCAL',
  })
  sectorLocal!: string;

  @AllowNull(true)
  @Column({
    type: DataType.JSON,
    allowNull: true,
    field: 'HORARIO',
  })
  horario!: Array<{
    dia: string;
    horaApertura?: string;
    horaCierre?: string;
    cerrado?: boolean;
  }>;

  @AllowNull(true)
  @Column({
    type: DataType.JSON,
    allowNull: true,
    field: 'FOTOS_LOCAL',
  })
  fotosLocal!: string[];

  @AllowNull(true)
  @Column({
    type: DataType.JSON,
    allowNull: true,
    field: 'FOTOS_LOGOTIPO',
  })
  fotosLogotipo!: string[];

  @AllowNull(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'ACEPTO_TERMINOS',
  })
  aceptoTerminos!: boolean;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    field: 'ESTADO',
  })
  estado!: 'PENDING' | 'APPROVED' | 'REJECTED';

  @AllowNull(true)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'COMISION',
  })
  comision!: number | null;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'CREATED_AT',
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'UPDATED_AT',
  })
  updatedAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'DELETED_AT',
  })
  deletedAt?: Date;
}
