import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, NotFoundError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { CreatePetOwnerDto } from './dto/create-pet-owner.dto';
import * as bcrypt from 'bcrypt';
import { CreateEntrepreneurDto } from './dto/create-entrepreneur.dto';

@Injectable()
export class AuthService {
  constructor(
    private httpService: HttpService,
    private readonly jwtService: JwtService
  ) { }

  //TODO: Implementar Token JWT
  async login(loginUserDto: LoginDto) {
    const { email, password } = loginUserDto;
    console.log(email);
    const user = await firstValueFrom(
      this.httpService.post('http://localhost:3001/api/users/email', {
        email: email,
      })
    )

    if (!user.data) {
      throw new RpcException({
        message: 'User/Password not valid'
      });
    }

    // const isPasswordValid = await bcrypt.compareSync(password, user.data.password);
    const isPasswordValid = password === user.data.password;
    if (!isPasswordValid) {
      throw new RpcException({
        message: 'User/Password not valid'
      });
    }
    const { password: _, ...result } = user.data;
    return result;
  }

  async registerPetOwner(createPetOwnerDto: CreatePetOwnerDto) {
    const {...petOwner } = createPetOwnerDto;
    const user = await firstValueFrom(
      this.httpService.post('http://localhost:3001/api/users/create-pet-owner', petOwner)
    )
    console.log(user.data);
    return user.data;
  }

  async loginEntrepreneur(loginDto: { email: string; password: string }) {
    const { email, password } = loginDto;
    console.log(`Login attempt for entrepreneur: ${email}`);

    // Buscar al emprendedor por email
    const userResponse = await firstValueFrom(
        this.httpService.post('http://localhost:3001/api/users/find-entrepreneur-by-email', {
            email,
        }),
    );

    const entrepreneur = userResponse.data;

    if (!entrepreneur) {
        throw new RpcException('Invalid email or password');
    }

    // Verificar si el estado es APPROVED
    if (entrepreneur.estado !== 'APPROVED') {
        throw new RpcException('Your account has not been approved yet');
    }

    // Validar la contraseña
    const isPasswordValid = await bcrypt.compare(password, entrepreneur.password);
    if (!isPasswordValid) {
        throw new RpcException('Invalid email or password');
    }

    // Retornar datos del usuario (sin contraseña) o generar un token JWT
    return {
        id: entrepreneur.id,
        email: entrepreneur.email,
        name: entrepreneur.name,
        businessName: entrepreneur.businessName,
        estado: entrepreneur.estado,
    };
}

  
  //TODO: Implementar registro de emprendedor (JP)
  async registerEntrepreneur(createEntrepreneurDto: CreateEntrepreneurDto) {
    const { ...entrepreneur } = createEntrepreneurDto;
  
    const user = await firstValueFrom(
      this.httpService.post('http://localhost:3001/api/users/create-entrepreneur', entrepreneur)
    );
  
    console.log('Entrepreneur registered:', user.data);
    return user.data;
  }
  


}
