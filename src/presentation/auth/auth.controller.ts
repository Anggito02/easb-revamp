import { Controller, Post, Body, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../application/auth/auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt_auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post('login')
    async login(@Body() body: { username: string; password: string }) {
        const user = await this.authService.validateUser(body.username, body.password);
        if (!user) throw new UnauthorizedException();
        return this.authService.login(user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('refresh')
    refresh(@Request() req) {
        return this.authService.login(req.user);
    }
}
