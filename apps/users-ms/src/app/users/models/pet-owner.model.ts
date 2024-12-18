import { Column, DataType, Table } from "sequelize-typescript";
import { User } from "./user.model";

@Table({
        tableName: 'USER_ACCOUNTS',
        paranoid: true,
})
export class PetOwner extends User {

        @Column({
                type: DataType.STRING,
                allowNull: true,
        })
        name: string

        @Column({
                type: DataType.STRING,
                allowNull: true,
        })
        urlPhoto: string

        @Column({
                type: DataType.TEXT,
                allowNull: true,
        })
        preferences: string

        @Column({
                type: DataType.TEXT,
                allowNull: true,
        })
        petPreferences: string

        @Column({
                type: DataType.STRING,
                allowNull: true,
        })
        phoneNumber: string

        @Column({
                type: DataType.TEXT,
                allowNull: true,
        })
        address: string
}
