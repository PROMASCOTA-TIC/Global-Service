import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreatePetOwnerDto } from './dto/create-pet-owner.dto';

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
  registerEntrepreneur(@Payload() createPetOwnerDto: CreatePetOwnerDto) {
    return this.authService.registerPetOwner(createPetOwnerDto);
  }
}
