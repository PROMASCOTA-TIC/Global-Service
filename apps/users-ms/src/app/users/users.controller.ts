import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Logger, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreatePetOwnerDto } from './dto/create-pet-owner.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { UpdatePetOwnerDto } from './dto/update-pet-owner.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { CreateEntrepreneurDTO } from './dto/create-entrepreneur.dto';
import { UpdateEntrepreneurDTO } from './dto/update-entrepreneur.dto';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(
    private readonly usersService: UsersService
  ) { }

  @MessagePattern('create_pet_owner')
  createPetOwner(@Payload() createPetOwnerDto: CreatePetOwnerDto) {
    return this.usersService.createPetOwner(createPetOwnerDto)
  }

  //TODO: Implementar el endpoint para crear un emprendedor (JP)
 /**
 * Crear un nuevo emprendedor
 */
@MessagePattern({ cmd: 'create_entrepreneur' })
async createEntrepreneur(@Payload() createEntrepreneurDto: CreateEntrepreneurDTO) {
  this.logger.log('Command received: create_entrepreneur', createEntrepreneurDto);
  return this.usersService.createEntrepreneur(createEntrepreneurDto);
}

/**
 * Obtener todos los emprendedores
 */
@MessagePattern({ cmd: 'get_all_entrepreneurs' })
async getAllEntrepreneurs() {
  this.logger.log('Command received: get_all_entrepreneurs');
  return this.usersService.findAllEntrepreneurs();
}

/**
 * Obtener emprendedores por estado
 */
@MessagePattern({ cmd: 'get_entrepreneurs_by_state' })
async getEntrepreneursByState(@Payload() estado: 'PENDING' | 'APPROVED' | 'REJECTED') {
  this.logger.log(`Command received: get_entrepreneurs_by_state for state ${estado}`);
  return this.usersService.findEntrepreneursByState(estado);
}

/**
 * Eliminar un emprendedor por su ID
 */
@MessagePattern({ cmd: 'delete_entrepreneur_by_id' })
async deleteEntrepreneurById(@Payload() id: string) {
  this.logger.log(`Command received: delete_entrepreneur_by_id for ID ${id}`);
  await this.usersService.deleteEntrepreneurById(id);
  return { message: 'Emprendedor eliminado exitosamente' };
}


/**
 * Cambiar el estado de un emprendedor
 */
@MessagePattern({ cmd: 'update_entrepreneur_status' })
async updateEntrepreneurStatus(
  @Payload() payload: { id: string; estado: 'PENDING' | 'APPROVED' | 'REJECTED' },
) {
  const { id, estado } = payload;
  this.logger.log(`Command received: update_entrepreneur_status for ID ${id} to ${estado}`);
  return this.usersService.updateEntrepreneurStatus(id, estado);
}

/**
 * Obtener un emprendedor por su ID
 */
@MessagePattern({ cmd: 'get_entrepreneur_by_id' })
async getEntrepreneurById(@Payload() id: string) {
  this.logger.log(`Command received: get_entrepreneur_by_id for ID ${id}`);
  return this.usersService.findEntrepreneurById(id);
}

/**
 * Actualizar un emprendedor por su ID
 */
@MessagePattern({ cmd: 'update_entrepreneur' })
async updateEntrepreneur(@Payload() payload: { id: string; updateData: UpdateEntrepreneurDTO }) {
  const { id, updateData } = payload;

  if (updateData.comision !== undefined) {
    this.logger.log(`Updating commission for Entrepreneur ID ${id}: ${updateData.comision}`);
  }

  return this.usersService.updateEntrepreneur(id, updateData);
}

/**
 * Actualizar solo la comisión de un emprendedor
 */
@MessagePattern({ cmd: 'update_entrepreneur_commission' })
async updateEntrepreneurCommission(@Payload() payload: { id: string; comision: number }) {
  const { id, comision } = payload;

  if (comision < 0 || comision > 100) {
    throw new BadRequestException('La comisión debe estar entre 0 y 100.');
  }

  this.logger.log(`Command received: update_entrepreneur_commission for ID ${id} with commission ${comision}`);
  return this.usersService.updateEntrepreneurCommission(id, comision);
}

   
  @MessagePattern('update_pet_owner')
  updateAdmin(@Payload() updateAdminDto: UpdateAdminDto) {
    return this.usersService.updatePetOwner( updateAdminDto.id, updateAdminDto);
  }
}
