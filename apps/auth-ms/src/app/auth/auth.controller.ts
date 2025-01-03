import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreatePetOwnerDto } from './dto/create-pet-owner.dto';
import { CreateEntrepreneurDTO } from './dto/create-entrepreneur.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('verify-token')
  verifyToken(@Payload() data: { token: string }) {
    return this.authService.verifyToken(data.token);
  }

  @MessagePattern('login-pet-owner')
  loginPetOwner(@Payload() loginDto: LoginDto) {
    return this.authService.loginPetOwner(loginDto);
  }

  @MessagePattern('login-admin')
  loginAdmin(@Payload() loginDto: LoginDto) {
    return this.authService.loginAdmin(loginDto);
  }

  @MessagePattern('register-pet-owner')
  registerPetOwner(@Payload() createPetOwnerDto: CreatePetOwnerDto) {
    console.log('Received data in Auth:', createPetOwnerDto);
    return this.authService.registerPetOwner(createPetOwnerDto);
  }

  @MessagePattern('register-entrepreneur')
  registerEntrepreneur(@Payload() createEntrepreneurDTO: CreateEntrepreneurDTO ) {
    console.log('Received data in Auth:', createEntrepreneurDTO);
    return this.authService.registerEntrepreneur(createEntrepreneurDTO);
  }

  @MessagePattern('login-entrepreneur')
  loginEntrepreneur(@Payload() loginDto: LoginDto) {
    return this.authService.loginEntrepreneur(loginDto);
  }

}
