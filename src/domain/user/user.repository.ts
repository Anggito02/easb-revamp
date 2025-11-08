import { CreateUserDto } from 'src/presentation/users/dto/create_user.dto';
import { User } from './user.entity';

export abstract class UserRepository {
    abstract findByUsername(username: string): Promise<User | null>;
    abstract findById(id: number): Promise<User | null>;
    abstract create(user: CreateUserDto): Promise<User>;
}
