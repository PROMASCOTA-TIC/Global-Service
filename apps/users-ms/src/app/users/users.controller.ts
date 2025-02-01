import { Controller, Logger, BadRequestException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { CreateEntrepreneurDTO } from './dto/create-entrepreneur.dto';
import { UpdateEntrepreneurDTO } from './dto/update-entrepreneur.dto';
import { CreatePetOwnerDto } from './dto/create-pet-owner.dto';
import { UsersService } from './users.service';
import { UpdateStatusAndCommissionDTO } from './dto/update-comission-status.dto';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(
    private readonly usersService: UsersService
  ) { }

  // Crear un nuevo emprendedor
  @MessagePattern({ cmd: 'create_entrepreneur' })
  async createEntrepreneur(@Payload() createEntrepreneurDto: CreateEntrepreneurDTO) {
    this.logger.log('Command received: create_entrepreneur', createEntrepreneurDto);
    return this.usersService.createEntrepreneur(createEntrepreneurDto);
  }

  // Obtener todos los emprendedores
  @MessagePattern({ cmd: 'get_all_entrepreneurs' })
  async getAllEntrepreneurs() {
    this.logger.log('Command received: get_all_entrepreneurs');
    return this.usersService.findAllEntrepreneurs();
  }

  // Eliminar un emprendedor por su ID
  @MessagePattern({ cmd: 'delete_entrepreneur_by_id' })
  async deleteEntrepreneurById(@Payload() id: string) {
    this.logger.log(`Command received: delete_entrepreneur_by_id for ID ${id}`);
    await this.usersService.deleteEntrepreneurById(id);
    return { message: 'Emprendedor eliminado exitosamente' };
  }

  //Obtener un emprendedor por su ID 
  @MessagePattern({ cmd: 'get_entrepreneur_by_id' })
  async getEntrepreneurById(@Payload() id: string) {
    this.logger.log(`Command received: get_entrepreneur_by_id for ID ${id}`);
    return this.usersService.findEntrepreneurById(id);
  }

  //actualizar emprendedor
  @MessagePattern('update_entrepreneur')
  async updateEntrepreneur(@Payload() updateEntrepreneurDto: UpdateEntrepreneurDTO) {
    const { idEntrepreneur, callePrincipal, calleSecundaria, numeracion, referencia } = updateEntrepreneurDto;
    
    if (!idEntrepreneur) {
      throw new BadRequestException('El campo idEntrepreneur es obligatorio.');
    }
  
    // Validar que la dirección esté completa solo si se está actualizando
    if ((callePrincipal || calleSecundaria || numeracion || referencia) &&
        (!callePrincipal || !calleSecundaria || !numeracion || !referencia)) {
      throw new BadRequestException('Si se actualiza la dirección, todos sus campos deben ser proporcionados.');
    }
  
    return this.usersService.updateEntrepreneur(idEntrepreneur, updateEntrepreneurDto);
  }

  
  // obtener emprendedor por estado
  @MessagePattern({ cmd: 'get_entrepreneurs_by_state' })
  async getEntrepreneursByState(@Payload() estado: 'PENDING' | 'APPROVED' | 'REJECTED') {
    this.logger.log(`Command received: get_entrepreneurs_by_state with estado=${estado}`);
    return this.usersService.findEntrepreneursByState(estado);
  }

//actualizar estado y copmision
@MessagePattern({ cmd: 'update_entrepreneur_status_and_commission' })
async updateEntrepreneurStatusAndCommission(
  @Payload() payload: { idEntrepreneur: string; updateStatusAndCommissionDTO: UpdateStatusAndCommissionDTO },
) {
  const { idEntrepreneur, updateStatusAndCommissionDTO } = payload;
  if (!idEntrepreneur) {
    throw new BadRequestException('El ID del emprendedor es obligatorio');
  }
  return this.usersService.updateEntrepreneurStatusAndCommission(
    idEntrepreneur,
    updateStatusAndCommissionDTO,
  );
}

  @MessagePattern('create_pet_owner')
  createPetOwner(@Payload() createPetOwnerDto: CreatePetOwnerDto) {
    return this.usersService.createPetOwner(createPetOwnerDto)
  }

  @MessagePattern('find_pet_owner_by_id')
  findPetOwnerById(@Payload() id: string) {
    return this.usersService.findPetOwnerById(id);
  }

  @MessagePattern('find_pet_owner_by_email')
  findPetOwnerByEmail(@Payload() data: {email: string}) {
    return this.usersService.findPetOwnerByEmail(data.email);
  }

  @MessagePattern('delete_pet_owner')
  deletePetOwner(@Payload() id: string) {
    return this.usersService.deletePetOwnerById(id);
  }

  @MessagePattern('update_pet_owner')
  updatePetOwner(@Payload() updateAdminDto: UpdateAdminDto) {
    return this.usersService.updatePetOwner(updateAdminDto.id, updateAdminDto);
  }

  @MessagePattern('find_admin_by_email')
  findAdminByEmail(@Payload() data: {email: string}) {
    return this.usersService.findAdminByEmail(data.email);
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
