import { Controller, Logger, BadRequestException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { CreateEntrepreneurDTO } from './dto/create-entrepreneur.dto';
import { UpdateEntrepreneurDTO } from './dto/update-entrepreneur.dto';
import { CreatePetOwnerDto } from './dto/create-pet-owner.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(
    private readonly usersService: UsersService
  ) { }

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

  /**
   * Actualizar el estado de un emprendedor 
   */
  @MessagePattern({ cmd: 'update_entrepreneur_status_and_commission' })
  async updateEntrepreneurStatusAndCommission(
    @Payload() payload: { id: string; estado: 'PENDING' | 'APPROVED' | 'REJECTED'; comision?: number },
  ) {
    const { id, estado, comision } = payload;

    // Validaciones
    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(estado)) {
      throw new BadRequestException('Estado inválido.');
    }

    if (estado === 'APPROVED' && comision === undefined) {
      throw new BadRequestException('La comisión es requerida para el estado APPROVED.');
    }

    if (comision !== undefined && (comision < 0 || comision > 100)) {
      throw new BadRequestException('La comisión debe estar entre 0 y 100.');
    }

    this.logger.log(
      `Command received: update_entrepreneur_status_and_commission for ID ${id} to ${estado} with commission ${comision}`,
    );

    return this.usersService.updateEntrepreneurStatusAndCommission(id, estado, comision);
  }

  @MessagePattern('create_pet_owner')
  createPetOwner(@Payload() createPetOwnerDto: CreatePetOwnerDto) {
    return this.usersService.createPetOwner(createPetOwnerDto)
  }

  @MessagePattern('find_pet_owner_by_id')
  findById(@Payload() id: string) {
    return this.usersService.findPetOwnerById(id);
  }

  @MessagePattern('find_pet_owner_by_email')
  findByEmail(@Payload() email: string) {
    return this.usersService.findPetOwnerByEmail(email);
  }

  @MessagePattern('delete_pet_owner')
  deletePetOwner(@Payload() id: string) {
    return this.usersService.deletePetOwnerById(id);
  }

  @MessagePattern('update_pet_owner')
  updateAdmin(@Payload() updateAdminDto: UpdateAdminDto) {
    return this.usersService.updatePetOwner(updateAdminDto.id, updateAdminDto);
  }

  @MessagePattern('find_entrepreneur_by_email')
  async findEntrepreneurByEmail(data: { email: string }) {
    console.log('Finding entrepreneur by email:', data?.email);

    if (!data?.email) {
      throw new Error('Email is required');
    }

    return this.usersService.findEntrepreneurByEmail(data.email);
  }
}
