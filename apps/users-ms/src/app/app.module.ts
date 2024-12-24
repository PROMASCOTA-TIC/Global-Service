import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';
import { User } from './users/models/user.model';
import { PetOwner } from './users/models/pet-owner.model';
import { envs } from '../config';
import { Entrepreneur } from './users/models/entrepreneur.model';

@Module({
  imports: [
    UsersModule,
    SequelizeModule.forRoot({
      dialect: envs.dbDialect as Dialect,
      logging: console.log,
      username: envs.dbUserUsername,
      password: envs.dbUserPassword,
      synchronize: true,
      autoLoadModels: true,
      dialectOptions: {
        connectString: envs.connectionString,      
      },
      //TODO: Agregar emprendedor al array de modelos (JP)
      models: [User, PetOwner,Entrepreneur],
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
