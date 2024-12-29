import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RpcException } from '@nestjs/microservices';
import { v4 as UuidV4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { CreatePetOwnerDto } from './dto/create-pet-owner.dto';
import { UpdatePetOwnerDto } from './dto/update-pet-owner.dto';
import { CreateEntrepreneurDTO } from './dto/create-entrepreneur.dto';
import { UpdateEntrepreneurDTO } from './dto/update-entrepreneur.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Entrepreneur } from './models/entrepreneur.model';
import { PetOwner } from './models/pet-owner.model';
import { User } from './models/user.model';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(PetOwner)
    private petOwner: typeof PetOwner,
    @InjectModel(User)
    private user: typeof User,
    @InjectModel(Entrepreneur)
    private readonly entrepreneurModel: typeof Entrepreneur,
  ) { }
  private readonly logger = new Logger(UsersService.name);

  async onModuleInit() {
    try {
      await this.petOwner.sequelize.authenticate();
      this.logger.log('Connection to the Oracle database is successful.')
    } catch (error) {
      this.logger.error(`Failed to connect to the Oracle database: ${error.message}`)
    }
  }

  /**
     * Crear un nuevo emprendedor
     */
  async createEntrepreneur(
    createEntrepreneurDto: CreateEntrepreneurDTO,
  ): Promise<Entrepreneur> {
    // Verificar si el correo electrónico ya está registrado
    const existingEmail = await this.findCreateEntrepreneurByEmail(
      createEntrepreneurDto.email,
    );

    if (existingEmail) {
      throw new BadRequestException(
        `El correo electrónico ${createEntrepreneurDto.email} ya está registrado.`,
      );
    }

    // Verificar si el RUC ya está registrado
    const existingRuc = await this.entrepreneurModel.findOne({
      where: { ruc: createEntrepreneurDto.ruc },
    });

    if (existingRuc) {
      throw new BadRequestException(
        `El RUC ${createEntrepreneurDto.ruc} ya está registrado.`,
      );
    }

    // Validar y completar el campo horario
    if (createEntrepreneurDto.horario) {
      const diasValidos = [
        'Lunes',
        'Martes',
        'Miércoles',
        'Jueves',
        'Viernes',
        'Sábado',
        'Domingo',
      ];
      createEntrepreneurDto.horario = diasValidos.map((dia) => {
        const diaEncontrado = createEntrepreneurDto.horario.find(
          (h) => h.dia === dia,
        );
        return (
          diaEncontrado || {
            dia,
            horaApertura: null,
            horaCierre: null,
            cerrado: '1', // Cerrado por defecto
          }
        );
      });
    }

    // Hashear la contraseña antes de almacenarla
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(createEntrepreneurDto.password, saltOrRounds);

    // Convertir booleanos a CHAR(1)
    const entrepreneurData = {
      ...createEntrepreneurDto,
      password: hashedPassword, // Asignar la contraseña hasheada
      isEntrepreneur: createEntrepreneurDto.isEntrepreneur,
      realizaEnvios: createEntrepreneurDto.realizaEnvios,
      soloRetiraEnTienda: createEntrepreneurDto.soloRetiraEnTienda,
      aceptoTerminos: createEntrepreneurDto.aceptoTerminos,
    };

    return await this.entrepreneurModel.create({
      ...entrepreneurData,
      estado: 'PENDING', // Estado inicial
      comision: null, // Comisión inicializada en null
    });
  }

  /**
   * Buscar un emprendedor por su ID
   */
  async findEntrepreneurById(id: string): Promise<Entrepreneur> {
    const entrepreneur = await this.entrepreneurModel.findOne({
      where: { id, isEntrepreneur: '1' },
    });
    if (!entrepreneur) {
      throw new NotFoundException(`El emprendedor con ID ${id} no existe.`);
    }
    return entrepreneur;
  }

  /**
   * Buscar emprendedores por estado
   */
  async findEntrepreneursByState(estado: 'PENDING' | 'APPROVED' | 'REJECTED'): Promise<Entrepreneur[]> {
    return await this.entrepreneurModel.findAll({
      where: { estado, isEntrepreneur: '1' },
    });
  }

  /**
   * Buscar un emprendedor por correo electrónico
   */
  async findCreateEntrepreneurByEmail(email: string): Promise<Entrepreneur | null> {
    return await this.entrepreneurModel.findOne({
      where: { email, isEntrepreneur: '1' },
    });
  }

  async findEntrepreneurByEmail(email: string) {
    console.log('Looking for entrepreneur in DB with email:', email);

    if (!email) {
      throw new RpcException('Email is required');
    }

    const entrepreneur = await this.entrepreneurModel.findOne({
      where: { email },
      attributes: ['id', 'email', 'name', 'password', 'nombreEmprendimiento', 'estado'], // Incluye solo los campos necesarios
    });

    if (!entrepreneur) {
      throw new RpcException('Entrepreneur not found');
    }

    return {
      id: entrepreneur.id,
      email: entrepreneur.email,
      name: entrepreneur.name,
      password: entrepreneur.password,
      businessName: entrepreneur.nombreEmprendimiento,
      estado: entrepreneur.estado,
    };
  }

  /**
   * Eliminar un emprendedor por su ID
   */
  async deleteEntrepreneurById(id: string): Promise<void> {
    const entrepreneur = await this.findEntrepreneurById(id);
    await entrepreneur.destroy();
  }

  /**
   * Cambiar el estado de un emprendedor
   */
  async updateEntrepreneurStatus(
    id: string,
    estado: 'PENDING' | 'APPROVED' | 'REJECTED',
  ): Promise<Entrepreneur> {
    const entrepreneur = await this.findEntrepreneurById(id);
    await entrepreneur.update({ estado });
    return entrepreneur;
  }

  /**
   * Obtener todos los emprendedores
   * @returns Lista de emprendedores
   */
  async findAllEntrepreneurs(): Promise<Entrepreneur[]> {
    return await this.entrepreneurModel.findAll({
      where: { isEntrepreneur: '1' }, // Filtrar solo emprendedores
      attributes: { exclude: ['password'] }, // Excluir la contraseña
    });
  }

  async createPetOwner(createPetOwnerDto: CreatePetOwnerDto) {
    const { preferences, petPreferences, address, password, ...rest } = createPetOwnerDto;
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      const user = {
        id: UuidV4(),
        preferences: preferences.join(', '),
        petPreferences: petPreferences.join(', '),
        address: address.join(', '),
        password: passwordHash,
        ...rest
      }
      console.log(user);
      await this.petOwner.create(user);
      return { message: 'Usuario creado correctamente' };
    } catch (error) {
      this.logger.error('Error al crear el usuario:', error.message);
      throw new Error(error.message);
    }
  }

  async findPetOwnerById(id: string) {
    const response = await this.petOwner.findByPk(id);
    if (!response) {
      throw new RpcException('User not found');
    }
    const user = {
      id: response.id,
      email: response.email,
      name: response.name,
      preferences: response.preferences,
      petPreferences: response.petPreferences,
      address: response.address,
      urlPhoto: response.urlPhoto,
      phoneNumber: response.phoneNumber,
    }
    return user;
  }

  async findPetOwnerByEmail(email: string) {
    const response = await this.petOwner.findOne({ where: { email } });
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
    this.findPetOwnerById(id);
    const { id: _, ...petOwner } = updatePetOwnerDto;
    return this.petOwner.update(petOwner, { where: { id } });
  }

  /**
  * Actualizar los datos de un emprendedor
  */
  async updateEntrepreneur(
    id: string,
    updateEntrepreneurDto: UpdateEntrepreneurDTO,
  ): Promise<Entrepreneur> {
    const entrepreneur = await this.findEntrepreneurById(id);

    if (
      updateEntrepreneurDto.email &&
      updateEntrepreneurDto.email !== entrepreneur.email
    ) {
      const emailExists = await this.findEntrepreneurByEmail(updateEntrepreneurDto.email);
      if (emailExists) {
        throw new BadRequestException(
          `El correo electrónico ${updateEntrepreneurDto.email} ya está en uso.`,
        );
      }
    }

    // Validar y completar el campo horario
    if (updateEntrepreneurDto.horario) {
      const diasValidos = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
      const horarioCompleto = diasValidos.map((dia) => {
        const diaEncontrado = updateEntrepreneurDto.horario.find((h) => h.dia === dia);
        return (
          diaEncontrado || { dia, horaApertura: null, horaCierre: null, cerrado: '1' } // Cerrado como '1'
        );
      });

      // Convertir el campo `cerrado` a CHAR(1)
      updateEntrepreneurDto.horario = horarioCompleto.map((h) => ({
        ...h,
        cerrado: h.cerrado === '1' || h.cerrado === '0' ? h.cerrado : '1', // Asegurar '1' o '0'
      }));
    }

    // Convertir booleanos a CHAR(1)
    const updateData = {
      ...updateEntrepreneurDto,
      realizaEnvios: updateEntrepreneurDto.realizaEnvios || '0',
      soloRetiraEnTienda: updateEntrepreneurDto.soloRetiraEnTienda || '0',
      aceptoTerminos: updateEntrepreneurDto.aceptoTerminos || '0',
    };

    await entrepreneur.update(updateData);
    return entrepreneur;
  }

  /**
   * Actualizar solo la comisión de un emprendedor
   */
  async updateEntrepreneurCommission(id: string, comision: number): Promise<Entrepreneur> {
    const entrepreneur = await this.findEntrepreneurById(id);
    if (comision < 0 || comision > 100) {
      throw new BadRequestException('La comisión debe estar entre 0 y 100.');
    }
    await entrepreneur.update({ comision });
    return entrepreneur;
  }

  /**
   * Actualizar el estado de un emprendedor y opcionalmente su comisión si el estado es APPROVED.
   */
  async updateEntrepreneurStatusAndCommission(
    id: string,
    estado: 'PENDING' | 'APPROVED' | 'REJECTED',
    comision?: number,
  ): Promise<Entrepreneur> {
    const entrepreneur = await this.findEntrepreneurById(id);

    // Validar el estado
    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(estado)) {
      throw new BadRequestException('Estado inválido.');
    }

    // Validar la comisión si el estado es APPROVED
    if (estado === 'APPROVED') {
      if (comision === undefined) {
        throw new BadRequestException('La comisión es requerida para el estado APPROVED.');
      }
      if (comision < 0 || comision > 100) {
        throw new BadRequestException('La comisión debe estar entre 0 y 100.');
      }
    }

    // Actualizar el emprendedor
    await entrepreneur.update({
      estado,
      ...(estado === 'APPROVED' && { comision }), // Actualizar comisión solo si es APPROVED
    });

    return entrepreneur;
  }

  async deletePetOwnerById(id: string) {
    await this.findPetOwnerById(id);
    await this.petOwner.destroy({ where: { id: id } });
  }

  async findAdminById(id: string) {
    const response = await this.user.findByPk(id);
    if (!response) {
      throw new RpcException('User not found');
    }
    const admin = {
      id: response.id,
      email: response.email,
    }
    return admin;
  }

  updateAdmin(id: string, updateAdminDto: UpdateAdminDto) {
    this.findAdminById(id);
    const { id: _, ...admin } = updateAdminDto;
    return this.user.update(admin, { where: { id } });
  }
}