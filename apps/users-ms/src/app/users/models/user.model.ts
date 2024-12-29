import { Column, DataType, Table, Model, HasOne } from 'sequelize-typescript';
import { PetOwner } from './pet-owner.model';
import { Entrepreneur } from './entrepreneur.model';

@Table({
  tableName: 'USER_ACCOUNTS',
  paranoid: true,
})
export class User extends Model {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4,
    field: 'ID',
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    field: 'EMAIL',
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'NAME',
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'PASSWORD',
  })
  password: string;

  @Column({
    type: DataType.CHAR(1),
    allowNull: true,
    field: 'IS_ENTREPRENEUR',
    defaultValue: '0',
  })
  isEntrepreneur?: boolean;

  @Column({
    type: DataType.CHAR(1),
    allowNull: true,
    field: 'IS_PET_OWNER',
    defaultValue: '0',
  })
  isPetOwner?: boolean;

  @Column({
    type: DataType.CHAR(1),
    allowNull: true,
    field: 'IS_ADMIN',
    defaultValue: '0',
  })
  isAdmin?: boolean;

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

  @HasOne(() => Entrepreneur)
  entrepreneur?: Entrepreneur;

  @HasOne(() => PetOwner)
  petOwner?: PetOwner;
}
