import { RpcException } from '@nestjs/microservices';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';
//import { CreateEntrepreneurDto } from './dto/create-entrepreneur.dto';
import { LoginDto } from './dto/login.dto';
import { envs } from '../../config';
import { CreatePetOwnerDto } from './dto/create-pet-owner.dto';
import { CreateEntrepreneurDTO } from './dto/create-entrepreneur.dto';

@Injectable()
export class AuthService {
  constructor(
    private httpService: HttpService,
    private readonly jwtService: JwtService
  ) { }

  async signJWT(email: string) {
    const token = this.jwtService.sign({ email });
    return token;
  }

  async verifyToken(token: string) {
    console.log('Verifying token:', token);
    
    if (!token) {
      throw new RpcException('Token is missing');
    }
  
    if (typeof token !== 'string' || token.split('.').length !== 3) {
      throw new RpcException('Invalid token format');
    }
  
    try {
      const { iat, exp, ...user  } = await this.jwtService.verify(token, {
        secret: envs.jwtSecretKey
      });
      console.log('User from token:', user);
      return user;
    } catch (error) {
      console.error('Error verifying token:', error);
      throw new RpcException('Invalid token');
    }
  }

  async loginAdmin(loginUserDto: LoginDto) {
    const { email, password } = loginUserDto;
    console.log(email);
    const user = await firstValueFrom(
      this.httpService.post('http://localhost:3001/api/users/admin-by-email', {
        email,
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
    const token = await this.signJWT(result.email);
    const adminData = {
      id: result.id,
      email: result.email,
      token: token
    }
    return adminData;
  }

  async loginPetOwner(loginUserDto: LoginDto) {
    const { email, password } = loginUserDto;
    const user = await firstValueFrom(
      this.httpService.post('http://localhost:3001/api/users/pet-owner-by-email', {
        email,
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
    const token = await this.signJWT(result.email);
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

async loginEntrepreneur(loginUserDto: LoginDto) {
  const { email, password } = loginUserDto;
  console.log(email);
  const user = await firstValueFrom(
    this.httpService.post('http://localhost:3001/api/users/find-entrepreneur-by-email', {
      email,
    })
  )
  const isPasswordValid = await bcrypt.compareSync(password, user.data.password);
  if(!isPasswordValid){
    throw new RpcException({
      message: 'User/Password not valid'
    });
  }
  const { password: _, ...result } = user.data;
  const token = await this.signJWT(result.email);
  const entrepreneurData = {
    id: result.id,
    email: result.email,
    token: token
  }
  return entrepreneurData;
}

async registerEntrepreneur(createEntrepreneurDto: CreateEntrepreneurDTO) {
  const { ...entrepreneur } = createEntrepreneurDto;

  const user = await firstValueFrom(
    this.httpService.post('http://localhost:3001/api/users/create-entrepreneur', entrepreneur)
  );

  console.log('Entrepreneur registered:', user.data);
  return user.data;
}

}
