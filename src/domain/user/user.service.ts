import { LoginDto } from "src/presentation/auth/dto/login.dto";
import { User } from "./user.entity";
import { CreateUserDto } from "src/presentation/users/dto/create_user.dto";

export abstract class UserService {
    abstract create(user: CreateUserDto): Promise<User>
    abstract validateUser(loginDto: LoginDto): Promise<User | null>
    abstract findByUsername(username: string): Promise<User | null>
}