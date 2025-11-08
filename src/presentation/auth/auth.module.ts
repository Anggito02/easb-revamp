import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../../application/auth/auth.service';
import { UserModule } from '../users/user.module';
import { JwtStrategy } from '../../application/auth/jwt.strategy';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RefreshJwtStrategy } from 'src/application/auth/refresh.strategy';
import { JwtAuthGuard } from 'src/common/guards/jwt_auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';



@Module({
  imports: [
    ConfigModule,
    UserModule,
    PassportModule.register({ session: false }),
    JwtModule.registerAsync({
        inject: [ConfigService],
        useFactory: (cfg: ConfigService): JwtModuleOptions => ({
            secret: cfg.getOrThrow<string>('jwt.accessSecret'),
            signOptions: { expiresIn: cfg.getOrThrow<number>('jwt.accessTtl') },
        }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RefreshJwtStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard }, 
    { provide: APP_GUARD, useClass: RolesGuard },  
  ],
  exports: [AuthService],
})
export class AuthModule {}