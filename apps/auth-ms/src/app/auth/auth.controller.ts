import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreatePetOwnerDto } from './dto/create-pet-owner.dto';
import { CreateEntrepreneurDto } from './dto/create-entrepreneur.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('login')
  create(@Payload() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @MessagePattern('register-pet-owner')
  registerPetOwner(@Payload() createPetOwnerDto: CreatePetOwnerDto) {
    return this.authService.registerPetOwner(createPetOwnerDto);
  }

  //TODO: Implementar el endpoint para registrar un emprendedor
  @MessagePattern('register-entrepreneur')
  async registerEntrepreneur(@Payload() createEntrepreneurDto: CreateEntrepreneurDto) {
    try {
      console.log('Received data in Auth:', createEntrepreneurDto);
  
      const result = await this.authService.registerEntrepreneur(createEntrepreneurDto);
      console.log('Result from User service:', result);
  
      return result;
    } catch (error) {
      console.error('Error in Auth registerEntrepreneur:', error);
      throw new RpcException(error.message || 'Internal server error in Auth');
    }
  }


  @MessagePattern('login-entrepreneur')
  async loginEntrepreneur(@Payload() loginDto: LoginDto) {
    try {
      console.log(`Login attempt for entrepreneur: ${loginDto.email}`);
      const result = await this.authService.loginEntrepreneur(loginDto);
      console.log('Entrepreneur authenticated:', result);
      return result;
    } catch (error) {
      console.error('Error in Auth loginEntrepreneur:', error);
      throw new RpcException(error.message || 'Invalid credentials');
    }
  }
  
}
