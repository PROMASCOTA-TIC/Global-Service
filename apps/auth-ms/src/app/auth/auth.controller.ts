import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreatePetOwnerDto } from './dto/create-pet-owner.dto';
import { CreateEntrepreneurDTO } from './dto/create-entrepreneur.dto';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
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
  async loginEntrepreneur(@Payload() loginDto: LoginDto) {
    try {
      return await this.authService.loginEntrepreneur(loginDto);
    } catch (error) {
      this.logger.error(`Error en loginEntrepreneur para ${loginDto.email}:`, error);
      
      if (error.error && error.error.status) {
        throw error;
      } else {
        throw {
          status: 500,
          message: 'Error interno en el servidor de autenticación'
        };
      }
    }
  }

}
