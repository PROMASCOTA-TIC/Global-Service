import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { envs } from '../../config';

@Module({
  imports: [
    HttpModule,
    JwtModule.register({
      global: true,
      secret: envs.jwtSecretKey,
      signOptions: { expiresIn: '1d' },
    })],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
