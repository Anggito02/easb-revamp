import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/domain/user/user.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
    ) {}
    async validateUser(username: string, pass: string) {
        const user = await this.usersService.findByUsername(username);
        if (user && bcrypt.compareSync(pass, user.passwordHash)) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user: any) {
        const payload = {
            username: user.username,
            sub: user.id,
            roles: user.roles,
        };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
}
