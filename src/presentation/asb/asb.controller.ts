import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AsbService } from '../../domain/asb/asb.service'
import { CreateAsbDto } from './dto/create_asb.dto';
import { JwtAuthGuard } from '../../common/guards/jwt_auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('asb')
export class AsbController {
    constructor(private readonly asbService: AsbService) {}
}
