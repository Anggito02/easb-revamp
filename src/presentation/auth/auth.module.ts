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
import { UserService } from 'src/domain/user/user.service';
import { UserServiceImpl } from 'src/application/user/user.service.impl';
import { UserRepositoryImpl } from 'src/infrastructure/user/repositories/user.repository.impl';
import { UserRepository } from 'src/domain/user/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from 'src/infrastructure/user/orm/user.orm_entity';



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
    TypeOrmModule.forFeature([UserOrmEntity])
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RefreshJwtStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard }, 
    { provide: APP_GUARD, useClass: RolesGuard },  
    UserServiceImpl,
    {
        provide: UserService,
        useExisting: UserServiceImpl,
    },
    UserRepositoryImpl,
    {
        provide: UserRepository,
        useExisting: UserRepositoryImpl,
    },
],
  exports: [AuthService],
})
export class AuthModule {}