import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "./user.model";

@Table({
	tableName: 'PET_OWNERS',
	paranoid: true,
})
export class PetOwner extends Model {

	@Column({
		type: DataType.STRING,
		primaryKey: true,
		allowNull: false,
		unique: true,
		defaultValue: DataType.UUIDV4,
		field: 'PET_OWNER_ID'
	})
	petOwnerId: string

	@ForeignKey(() => User)
	@Column({
		type: DataType.STRING,
		allowNull: false,
		field: 'USER_ID'
	})
	userId: string

	@BelongsTo(() => User)
	user: User

	@Column({
		type: DataType.STRING,
		allowNull: true,
		field: 'URL_PHOTO'
	})
	urlPhoto: string

	@Column({
		type: DataType.TEXT,
		allowNull: true,
		field: 'PREFERENCES'
	})
	preferences: string

	@Column({
		type: DataType.TEXT,
		allowNull: true,
		field: 'PET_PREFERENCES'
	})
	petPreferences: string

	@Column({
		type: DataType.STRING,
		allowNull: true,
		field: 'PHONE_NUMBER'
	})
	phoneNumber: string

	@Column({
		type: DataType.TEXT,
		allowNull: true,
		field: 'ADDRESSES'
	})
	addresses: string

	@Column({
		type: DataType.DATE,
		allowNull: false,
		field: 'CREATED_AT',
		defaultValue: () => new Date(Date.now() - 5 * 60 * 60 * 1000),
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
