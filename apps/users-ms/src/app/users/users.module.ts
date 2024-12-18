import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Sequelize } from 'sequelize';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { PetOwner } from './models/pet-owner.model';

@Module({
  //TODO: Agregar el ENTREPRENEUR (JP)
  imports: [SequelizeModule.forFeature([User,PetOwner])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
