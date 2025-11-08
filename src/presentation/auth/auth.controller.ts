import { Controller, Post, Body, UseGuards, Res, Req } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from '../../application/auth/auth.service';
import { ResponseDto } from 'src/common/dto/response.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { RefreshJwtAuthGuard } from 'src/common/guards/jwt_refresh.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @Post('login')
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response): Promise<ResponseDto> {
        const user = await this.authService.validateUser(dto);
        const token = await this.authService.login(user);

        // SET refresh token via HttpOnly cookie
        res.cookie('refreshToken', token.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/api/dev/v1/auth',
            maxAge: token.maxAgeRefresh, // <- gunakan ms dari service
        });

        return {
            status: 'success',
            responseCode: 200,
            message: 'Login successful',
            data: {
                accessToken: token.accessToken,
            },
        };
    }

    @Public() 
    @UseGuards(RefreshJwtAuthGuard)
    @Post('refresh')
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<ResponseDto> {
        const user = req.user as any; // { sub, username, roles }
        const tokens = await this.authService.rotateTokens({ id: user.sub, username: user.username, roles: user.roles } as any);

        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict', 
            path: '/api/dev/v1/auth',
            maxAge: tokens.maxAgeRefresh,
        });

        return { status: 'success', responseCode: 200, message: 'Token Rotated', data: { accessToken: tokens.accessToken } };
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response): Promise<ResponseDto> {
        res.clearCookie('refreshToken', { path: '/api/dev/v1/auth' });
        return { status: 'success', responseCode: 200, message: 'Logged out', data: null };
    }
}
