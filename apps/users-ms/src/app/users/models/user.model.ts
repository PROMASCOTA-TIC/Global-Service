import { Column, DataType, Table, Model } from "sequelize-typescript"

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
        })
        id: string

        @Column({
                type: DataType.STRING,
                allowNull: false,
        })
        email: string

        @Column({
                type: DataType.STRING,
                allowNull: false,
        })
        password: string

        @Column({
                type: DataType.CHAR(1),
                allowNull: true,
        })
        isEntrepreneur?: boolean

        @Column({
                type: DataType.CHAR(1),
                allowNull: true,
        })
        isPetOwner?: boolean

        @Column({
                type: DataType.CHAR(1),
                allowNull: true,
        })
        isAdmin?: boolean

        @Column({
                type: DataType.DATE,
                allowNull: false,
                field: 'CREATEDAT',
        })
        createdAt: Date;

        @Column({
                type: DataType.DATE,
                allowNull: true,
                field: 'UPDATEDAT',
        })
        updatedAt?: Date;

        @Column({
                type: DataType.DATE,
                allowNull: true,
                field: 'DELETEDAT',
        })
        deletedAt?: Date;
}
