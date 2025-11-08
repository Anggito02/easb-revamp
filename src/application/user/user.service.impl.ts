import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/user/user.repository';
import { User } from '../../domain/user/user.entity';
import { ValidateUserUseCase } from './use_cases/validate_user.use_case';
import { UserService } from 'src/domain/user/user.service';
import { LoginDto } from 'src/presentation/auth/dto/login.dto';
import { CreateUserDto } from 'src/presentation/users/dto/create_user.dto';

@Injectable()
export class UserServiceImpl implements UserService {
    private readonly validateUserUseCase: ValidateUserUseCase;

    constructor(private readonly userRepo: UserRepository) {
        this.validateUserUseCase = new ValidateUserUseCase(userRepo);
    }

    create(user: CreateUserDto): Promise<User> { return this.userRepo.create(user); }

    validateUser(dto: LoginDto): Promise<User | null> {
        return this.validateUserUseCase.execute(dto);
    }

    findByUsername(username: string): Promise<User | null> {
        return this.userRepo.findByUsername(username);
    }
}
