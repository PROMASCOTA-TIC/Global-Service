import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreatePetOwnerDto } from './dto/create-pet-owner.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UpdatePetOwnerDto } from './dto/update-pet-owner.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) { }

  @MessagePattern('create_pet_owner')
  createPetOwner(@Payload() createPetOwnerDto: CreatePetOwnerDto) {
    return this.usersService.createPetOwner(createPetOwnerDto)
  }

  //TODO: Implementar el endpoint para crear un emprendedor (JP)
  @MessagePattern('create_entrepreneur')
  createEntrepreneur() {
    // return this.usersService.createEntrepreneur()
  }

  @MessagePattern('find_by_id')
  findById(@Payload('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id);
  }

  @MessagePattern('find_by_email')
  findByEmail(@Payload() email: string) {
    return this.usersService.findByEmail(email);
  }

  @MessagePattern('update_pet_owner')
  updatePetOwner(@Payload() updatePetOwner: UpdatePetOwnerDto) {
    return this.usersService.updatePetOwner( updatePetOwner.id, updatePetOwner);
  }

  @MessagePattern('update_pet_owner')
  updateEntrepreneur() {
    // return this.usersService.updatePetOwner( );
  }

  @MessagePattern('update_pet_owner')
  updateAdmin(@Payload() updateAdminDto: UpdateAdminDto) {
    return this.usersService.updatePetOwner( updateAdminDto.id, updateAdminDto);
  }
}
