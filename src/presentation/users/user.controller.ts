import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../../domain/user/user.service';
import { JwtAuthGuard } from '../../common/guards/jwt_auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateUserDto } from './dto/create_user.dto';
  import { ResponseDto } from '../../common/dto/response.dto';
import * as bcrypt from 'bcryptjs';
import { Role } from 'src/domain/user/user_role.enum';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** Membuat user baru. Hanya peran 'admin' yang boleh. */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() dto: CreateUserDto): Promise<ResponseDto> {
    // Hash password sebelum menyimpan
    const hash = bcrypt.hashSync(dto.password, 10);
    const user = await this.userService.create({
      username: dto.username,
      password: hash,
      roles: dto.roles,
    });
    return {
      status: 'success',
      responseCode: 200,
      message: 'User created',
      data: user,
    };
  }
}
