import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { PetOwner } from './models/pet-owner.model';
import { Entrepreneur } from './models/entrepreneur.model';

@Module({
  imports: [SequelizeModule.forFeature([User,PetOwner,Entrepreneur])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
