import { UserRepository } from '../../../domain/user/user.repository';
import { User } from '../../../domain/user/user.entity';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from 'src/presentation/auth/dto/login.dto';

export class ValidateUserUseCase {
    constructor(private readonly userRepo: UserRepository) {}

    async execute(dto: LoginDto): Promise<User | null> {
        const user = await this.userRepo.findByUsername(dto.username);
        if (!user) return null;
        const ok = await bcrypt.compare(dto.password, user.passwordHash? user.passwordHash : '');

        if (!ok) return null;
        const { passwordHash, ...safe } = user as any;

        return safe as User;
    }
}
