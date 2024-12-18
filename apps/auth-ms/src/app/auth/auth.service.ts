import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, NotFoundError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { CreatePetOwnerDto } from './dto/create-pet-owner.dto';
import * as bcrypt from 'bcrypt';

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

  //TODO: Implementar registro de emprendedor (JP)
  // async registerEntrepreneur(createUserDto: CreateUserDto) {

  //   const user = await firstValueFrom(
  //     this.httpService.post('http://localhost:3001/api/users', {
  //       email: email,
  //       password: password,
  //     })
  //   )
  //   return user.data;
  // }

}
