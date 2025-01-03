import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RpcException } from '@nestjs/microservices';
import { v4 as UuidV4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { CreatePetOwnerDto } from './dto/create-pet-owner.dto';
import { UpdatePetOwnerDto } from './dto/update-pet-owner.dto';
import { CreateEntrepreneurDTO } from './dto/create-entrepreneur.dto';
import { UpdateEntrepreneurDTO } from './dto/update-entrepreneur.dto';
import { UpdateStatusAndCommissionDTO } from './dto/update-comission-status.dto';
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

    //Sevicio para crear un nuevo emprendedor

    async createEntrepreneur(createEntrepreneurDto: CreateEntrepreneurDTO) {
        const {
            email,
            password,
            name,
            nombreEmprendimiento,
            ruc,
            numeroCelular,
            bancoNombre,
            bancoTipoCuenta,
            bancoNumeroCuenta,
            bancoNombreDuenoCuenta,
            realizaEnvios,
            soloRetiraEnTienda,
            direccionLocal,
            sectorLocal,
            horario,
            aceptoTerminos,
            ...rest
        } = createEntrepreneurDto;

        try {
            // Hashear la contraseña
            const passwordHash = await bcrypt.hash(password, 10);

            // Crear usuario
            const user = await this.createUser({
                email,
                password: passwordHash,
                name,
                isEntrepreneur: '1',
            });

            const entrepreneurData = {
                identity: UuidV4(),
                userId: user.id,
                nombreEmprendimiento,
                ruc,
                numeroCelular,
                bancoNombre,
                bancoTipoCuenta,
                bancoNumeroCuenta,
                bancoNombreDuenoCuenta,
                realizaEnvios: realizaEnvios === '1',
                soloRetiraEnTienda: soloRetiraEnTienda === '1', // Convertir a booleano
                direccionLocal, // Asegúrate de que esté presente
                sectorLocal, // Asegúrate de que esté presente
                horario: horario || [], // Evitar errores si está undefined
                aceptoTerminos: aceptoTerminos === '1', // Convertir a booleano
                estado: 'PENDING', // Valor predeterminado para estado
                comision: rest.comision || null,
                ...rest,
            };

            console.log('Datos del emprendedor:', entrepreneurData);

            // Guardar en la base de datos
            const entrepreneur = await this.entrepreneurModel.create(entrepreneurData);
            //await this.entrepreneurModel.create(entrepreneurData);

            return {
                message: 'Usuario creado correctamente',
                user,
                entrepreneur,
            };
        } catch (error) {
            if (error.errors) {
                error.errors.forEach((err) => {
                    this.logger.error(`Error en el campo ${err.path}: ${err.message}`);
                });
            } else {
                this.logger.error('Error no identificado:', error.message);
            }
            throw new BadRequestException(error.message);
        }
    }


    /**Obtener todos los emprendedores*/
    async findAllEntrepreneurs(): Promise<Entrepreneur[]> {
        return await this.entrepreneurModel.findAll({
            include: [
                {
                    model: this.user,
                    where: { isEntrepreneur: '1' },
                    attributes: ['id', 'email', 'name', 'createdAt'],
                    required: true,
                },
            ],
            attributes: { exclude: ['password'] }, // Excluir la contraseña del emprendedor
        });
    }

    /**Buscar un emprendedor por su ID*/
    async findEntrepreneurById(id: string) {
        const response = await this.entrepreneurModel.findByPk(id,
            {
                include: [User]
            }
        );
        if (!response) {
            throw new RpcException('User not found');
        }
        const entrepreneur = {
            idEntrepreneur: response.idEntrepreneur,
            email: response.user.email,
            name: response.user.name,
            businessName: response.nombreEmprendimiento,
            ruc: response.ruc,
            phoneNumber: response.numeroCelular,
            bankName: response.bancoNombre,
            bankAccountType: response.bancoTipoCuenta,
            bankAccountNumber: response.bancoNumeroCuenta,
            bankAccountOwner: response.bancoNombreDuenoCuenta,
            makeDeliveries: response.realizaEnvios,
            onlyPickUpInStore: response.soloRetiraEnTienda,
            localAddress: response.direccionLocal,
            localSector: response.sectorLocal,
            businessHours: response.horario,
            acceptedTerms: response.aceptoTerminos,
            state: response.estado,
            commission: response.comision,
        }
        return entrepreneur;
    }

    /**
     * Eliminar un emprendedor por su ID */
    async deleteEntrepreneurById(idEntrepreneur: string): Promise<void> {
        try {
            const entrepreneur = await this.entrepreneurModel.findOne({
                where: { idEntrepreneur: idEntrepreneur },
                include: [
                    {
                        model: this.user,
                        attributes: ['id'],
                    },
                ],
            });

            if (!entrepreneur) {
                throw new NotFoundException(`El emprendedor con ID ${idEntrepreneur} no existe.`);
            }
            if (entrepreneur.user) {
                await this.user.update(
                    { deletedAt: new Date() },
                    { where: { id: entrepreneur.user.id } }
                );
            }
            await entrepreneur.destroy();
            this.logger.log(
                `El emprendedor con ID ${idEntrepreneur} y su usuario relacionado han sido eliminados.`
            );
        } catch (error) {
            this.logger.error(
                `Error al eliminar el emprendedor con ID ${idEntrepreneur}:`,
                error.message
            );
            throw new BadRequestException(`No se pudo eliminar el emprendedor: ${error.message}`);
        }
    }



    // Buscar emprendedor por correo electronicvo 
    async findEntrepreneurByEmail(email: string) {
        console.log('Looking for entrepreneur in DB with email:', email);
        const response = await this.user.findOne({
            where: { email: email, isEntrepreneur: '1' },
            include: [Entrepreneur]
        });
        if (!response) {
            throw new RpcException('User not found');
        }
        const entrEpreneur = {
            id: response.entrepreneur.id,
            email: response.email,
            password: response.password,
        }
        return entrEpreneur;

    }
    //actualizar emprendedor
    async updateEntrepreneur(idEntrepreneur: string, updateEntrepreneurDto: UpdateEntrepreneurDTO) {
        const entrepreneur = await this.entrepreneurModel.findOne({
            where: { idEntrepreneur },
        });

        if (!entrepreneur) {
            throw new NotFoundException(`No se encontró un emprendedor con el ID: ${idEntrepreneur}`);
        }
        const { idEntrepreneur: _, ...updateData } = updateEntrepreneurDto;

        // Convertir valores booleanos para el modelo
        const updatePayload = {
            ...updateData,
            realizaEnvios: updateData.realizaEnvios === '1', // Convertir a booleano si está presente
            soloRetiraEnTienda: updateData.soloRetiraEnTienda === '1', // Convertir a booleano si está presente
        };

        // Actualizar el emprendedor
        await this.entrepreneurModel.update(updatePayload, {
            where: { idEntrepreneur },
        });

        return { message: 'Emprendedor actualizado correctamente' };
    }

    // obtener emprendedores por estado
    async findEntrepreneursByState(estado: 'PENDING' | 'APPROVED' | 'REJECTED'): Promise<Entrepreneur[]> {
        if (!['PENDING', 'APPROVED', 'REJECTED'].includes(estado)) {
            throw new BadRequestException(`Estado inválido: ${estado}`);
        }

        const entrepreneurs = await this.entrepreneurModel.findAll({
            where: { estado },
            include: [
                {
                    model: this.user,
                    attributes: ['id', 'email', 'name'],
                },
            ],
        });

        if (!entrepreneurs.length) {
            throw new NotFoundException(`No se encontraron emprendedores con el estado: ${estado}`);
        }

        return entrepreneurs;
    }

    //update status y comision
    async updateEntrepreneurStatusAndCommission(
        idEntrepreneur: string,
        updateStatusAndCommissionDTO: UpdateStatusAndCommissionDTO,
    ) {
        const entrepreneur = await this.entrepreneurModel.findOne({
            where: { idEntrepreneur },
        });

        if (!entrepreneur) {
            throw new NotFoundException(`No se encontró un emprendedor con el ID: ${idEntrepreneur}`);
        }

        const { estado, comision } = updateStatusAndCommissionDTO;

        if (estado === 'APPROVED' && (comision === undefined || comision === null)) {
            throw new BadRequestException(
                'La comisión es obligatoria cuando el estado es APPROVED',
            );
        }

        if (estado === 'REJECTED' && comision !== undefined) {
            throw new BadRequestException('La comisión no debe asignarse cuando el estado es REJECTED');
        }

        await this.entrepreneurModel.update(
            { estado, comision: estado === 'APPROVED' ? comision : null },
            { where: { idEntrepreneur } },
        );

        return { message: `El estado y la comisión del emprendedor han sido actualizados` };
    }

    // Buscar un emprendedor por correo electrónico
    async findCreateEntrepreneurByEmail(email: string): Promise<Entrepreneur | null> {
        return await this.entrepreneurModel.findOne({
            where: { email, isEntrepreneur: '1' },
        });
    }

    async createPetOwner(createPetOwnerDto: CreatePetOwnerDto) {
        const { preferences, petPreferences, addresses, name, email, password, ...rest } = createPetOwnerDto;
        try {
            const passwordHash = await bcrypt.hash(password, 10);

            const user = await this.createUser({
                email,
                password: passwordHash,
                name,
                isPetOwner: '1',
            });

            const petOwner = {
                id: UuidV4(),
                userId: user.id,
                preferences: preferences.join(', '),
                petPreferences: petPreferences.join(', '),
                addresses: addresses?.join(', '),
                ...rest
            }
            console.log(petOwner);
            await this.petOwner.create(petOwner);
            return { message: 'Usuario creado correctamente' };
        } catch (error) {
            this.logger.error('Error al crear el usuario:', error.message);
            throw new Error(error.message);
        }
    }

    async findPetOwnerById(id: string) {
        const response = await this.petOwner.findByPk(
            id,
            {
                include: [User]
            }
        );
        if (!response) {
            throw new RpcException('User not found');
        }
        const petOwner = {
            id: response.petOwnerId,
            userId: response.userId,
            email: response.user.email,
            name: response.user.name,
            preferences: response.preferences,
            petPreferences: response.petPreferences,
            addresses: response.addresses,
            urlPhoto: response.urlPhoto,
            phoneNumber: response.phoneNumber,
        }
        return petOwner;
    }

    async findPetOwnerByEmail(email: string) {
        console.log('Looking for pet owner in DB with email:', email);
        const response = await this.user.findOne({
            where: { email: email, isPetOwner: '1' },
            include: [PetOwner]
        });
        if (!response) {
            throw new RpcException('User not found');
        }
        const petOwner = {
            id: response.petOwner.id,
            email: response.email,
            password: response.password,
        }
        return petOwner;
    }

    async updatePetOwner(id: string, updatePetOwnerDto: UpdatePetOwnerDto) {
        const petOwner = await this.findPetOwnerById(id);
        const userId = petOwner.userId;
        const { id: _, name, ...rest } = updatePetOwnerDto;
        const responsePetOwner = await this.petOwner.update(rest, { where: { id } });
        const responseUser = await this.user.update({ name }, { where: { userId } });
        if (!responsePetOwner || !responseUser) {
            throw new RpcException('Error updating pet owner');
        }
        return { message: 'Dueño de mascota actualizado correctamente' };
    }

    async deletePetOwnerById(id: string) {
        const petOwner = await this.findPetOwnerById(id);
        const response = await this.petOwner.destroy({ where: { petOwnerId: id } });
        const userResponse = await this.user.destroy({ where: { id: petOwner.userId } });
        if (!response || !userResponse) {
            throw new RpcException('Error deleting pet owner');
        }
        return { message: 'Dueño de mascota eliminado correctamente' };
    }

    async createUser(createUserDto: CreateUserDto) {
        const { password } = createUserDto;
        try {
            const passwordHash = await bcrypt.hash(password, 10);
            const user = await this.user.create({
                id: UuidV4(),
                password: passwordHash,
                ...createUserDto,
            });
            return user;
        } catch (error) {
            this.logger.error('Error al crear el usuario:', error.message);
            throw new Error(error.message);
        }
    }

    async findAdminById(id: string) {
        const response = await this.user.findOne(
            {
                where: {
                    id,
                    isAdmin: '1'
                },
            }
        );
        if (!response) {
            throw new RpcException('User not found');
        }
        const admin = {
            id: response.id,
            email: response.email,
        }
        return admin;
    }

    async findAdminByEmail(email: string) {
        const response = await this.user.findOne({
            where: {
                email,
                isAdmin: '1'
            }
        });
        if (!response) {
            throw new RpcException('User not found');
        }
        const admin = {
            id: response.id,
            email: response.email,
            password: response.password,
        }
        return admin;
    }

    updateAdmin(id: string, updateAdminDto: UpdateAdminDto) {
        this.findAdminById(id);
        const { id: _, ...admin } = updateAdminDto;
        return this.user.update(admin, { where: { id } });
    }
}