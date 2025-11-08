import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/domain/user/user.service';
import { LoginDto } from 'src/presentation/auth/dto/login.dto';
import { User } from 'src/domain/user/user.entity';

type Tokens = { accessToken: string; refreshToken: string, maxAgeAccess: number, maxAgeRefresh: number };

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
    ) {}

    async validateUser(dto: LoginDto): Promise<User> {
        const user = await this.userService.validateUser(dto); // lakukan bcrypt.compare di use case
        if (!user) throw new UnauthorizedException('Invalid credentials');
        return user;
    }

    private signAccess(user: User): string {
        const payload = { sub: String(user.id), username: user.username, roles: user.roles };
        return this.jwt.sign(payload, {
            secret: this.config.getOrThrow<string>('jwt.accessSecret'),
            expiresIn: this.config.getOrThrow<number>('jwt.accessTtl'),
        });
    }

    private signRefresh(user: User): string {
        const payload = { 
            sub: String(user.id), 
            username: user.username, 
            roles: user.roles,
            tokenVersion: user.refreshTokenVersion ?? 0,
         };

        return this.jwt.sign(payload, {
        secret: this.config.getOrThrow<string>('jwt.refreshSecret'),
        expiresIn: this.config.getOrThrow<number>('jwt.refreshTtl'), // e.g. "7d"
        });
    }

    async login(user: User): Promise<Tokens> {
        return {
            accessToken: this.signAccess(user),
            refreshToken: this.signRefresh(user),
            maxAgeAccess: this.config.getOrThrow<number>('jwt.accessTtl') * 1000,
            maxAgeRefresh: this.config.getOrThrow<number>('jwt.refreshTtl') * 1000,
        };
    }

    async rotateTokens(user: User): Promise<Tokens> {
        return this.login(user);
    }
}
