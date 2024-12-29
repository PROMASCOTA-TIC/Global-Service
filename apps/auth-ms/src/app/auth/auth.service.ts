import { RpcException } from '@nestjs/microservices';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';
import { CreateEntrepreneurDto } from './dto/create-entrepreneur.dto';
import { CreatePetOwnerDto } from './dto/create-pet-owner.dto';
import { LoginDto } from './dto/login.dto';
import { envs } from '../../config';

@Injectable()
export class AuthService {
  constructor(
    private httpService: HttpService,
    private readonly jwtService: JwtService
  ) { }

  async signJWT(id: string, email: string) {
    return this.jwtService.sign({ id, email });
  }

  async verifyToken(token: string) {
    try {
      const { sub, iat, exp, ...user } = this.jwtService.verify(token, {
        secret: envs.jwtSecretKey,
      });
      return user;
    } catch (error) {
      throw new RpcException('Invalid token');
    }
  }

  async invalidateToken(token: string) {
    try {
      await this.invalidateToken(token);
      return true;
    } catch (error) {
      throw new RpcException('Invalidate token failed');
    }
  }

  async loginAdmin(loginUserDto: LoginDto) {
    const { email, password } = loginUserDto;
    console.log(email);
    const user = await firstValueFrom(
      this.httpService.post('http://localhost:3001/api/users/admin-by-email', {
        email: email,
      })
    )

    if (!user.data) {
      throw new RpcException({
        message: 'User/Password not valid'
      });
    }

    const isPasswordValid = await bcrypt.compareSync(password, user.data.password);
    if (!isPasswordValid) {
      throw new RpcException({
        message: 'User/Password not valid'
      });
    }
    const { password: _, ...result } = user.data;
    const token = this.signJWT(result.id, result.email);
    const adminData = {
      id: result.id,
      email: result.email,
      token: token
    }
    return adminData;
  }

  async loginPetOwner(loginUserDto: LoginDto) {
    const { email, password } = loginUserDto;
    console.log(email);
    const user = await firstValueFrom(
      this.httpService.post('http://localhost:3001/api/users/pet-owner-by-email', {
        email: email,
      })
    )

    if (!user.data) {
      throw new RpcException({
        message: 'User/Password not valid'
      });
    }

    const isPasswordValid = await bcrypt.compareSync(password, user.data.password);
    if (!isPasswordValid) {
      throw new RpcException({
        message: 'User/Password not valid'
      });
    }
    const { password: _, ...result } = user.data;
    const token = this.signJWT(result.id, result.email);
    const petOwnerData = {
      id: result.id,
      email: result.email,
      token: token
    }
    return petOwnerData;
  }

  async registerPetOwner(createPetOwnerDto: CreatePetOwnerDto) {
    const { ...petOwner } = createPetOwnerDto;
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
