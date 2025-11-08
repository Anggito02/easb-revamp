import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserService } from 'src/domain/user/user.service';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        config: ConfigService,
        private readonly userService: UserService,
    ) {
        super({
        jwtFromRequest: ExtractJwt.fromExtractors([
            (req: Request) => req?.cookies?.refreshToken || null,
            ExtractJwt.fromAuthHeaderAsBearerToken(),
        ]),
        ignoreExpiration: false,
        secretOrKey: config.getOrThrow<string>('jwt.refreshSecret'),
        passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: any) {
        const token = req?.cookies?.refresh_token || req.headers.authorization?.split(' ')[1];

        if (!token) throw new UnauthorizedException('Missing refresh token');

        const user = await this.userService.findByUsername(payload.username);
        if (!user) throw new UnauthorizedException('User not found');

        if (payload.tokenVersion !== (user.refreshTokenVersion ?? 0)) {
            throw new UnauthorizedException('Refresh token revoked');
        }

        return {
            sub: payload.sub,
            username: payload.username,
            roles: payload.roles,
        };
    }
}