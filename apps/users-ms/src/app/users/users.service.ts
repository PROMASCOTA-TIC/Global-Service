import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CreatePetOwnerDto } from './dto/create-pet-owner.dto';
import { PetOwner } from './models/pet-owner.model';
import { InjectModel } from '@nestjs/sequelize';
import { RpcException } from '@nestjs/microservices';
import { UpdatePetOwnerDto } from './dto/update-pet-owner.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { User } from './models/user.model';
import { v4 as UuidV4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(PetOwner)
    private petOwner: typeof PetOwner,
    @InjectModel(User)
    private user: typeof User,
  ){}
  private readonly logger = new Logger(UsersService.name);

  async onModuleInit() {
    try {
      await this.petOwner.sequelize.authenticate();
      this.logger.log('Connection to the Oracle database is successful.')
    } catch (error) {
      this.logger.error(`Failed to connect to the Oracle database: ${error.message}`)
    }
  }

  async createPetOwner(createPetOwnerDto: CreatePetOwnerDto) {
    const { preferences, petPreferences, address, ...rest } = createPetOwnerDto;
    try {
      const user = {
        id: UuidV4(),
        preferences: preferences.join(', '), 
        petPreferences: petPreferences.join(', '),
        address: address.join(', '), 
        ...rest
      }      
      console.log(user);
      await this.petOwner.create(user);
      return { message: 'Pet owner created successfully' };
    } catch (error) {
      this.logger.error('Error creating user:', error.message);
      throw new Error(error.message);
    }
  }

  //TODO: Implementar el endpoint para crear un emprendedor (JP)
  createEntrepreneur(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findById(id: string) {
    const response = await this.petOwner.findByPk(id);
    if (!response) {
      throw new RpcException('User not found');
    }
    const user = {
      id: response.id,
    }
    return user;
  }

  async findByEmail(email: string) {
    const response = await this.petOwner.findOne({ where:  {email} });
    if (!response) {
      throw new RpcException('User not found');
    }
    const user = {
      id: response.id,
      email: response.email,
      password: response.password,
    }
    return user;
  }

  updatePetOwner(id: string, updatePetOwnerDto: UpdatePetOwnerDto) {
    this.findById(id);
    const { id: _, ...petOwner } = updatePetOwnerDto;
    return this.petOwner.update(petOwner, { where: { id } });
  }

  //TODO: Implementar el endpoint para actualizar un emprendedor (JP)
  updateEntrepreneur(){
    return 'This action updates a user';
  }

  updateAdmin(id: string, updateAdminDto: UpdateAdminDto) {
    this.findById(id);
    const { id: _, ...admin } = updateAdminDto;
    return this.user.update(admin, { where: { id } });
  }
}
