import { Controller, Post, Body, UseGuards, Res, Req } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from '../../application/auth/auth.service';
import { ResponseDto } from 'src/common/dto/response.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { RefreshJwtAuthGuard } from 'src/common/guards/jwt_refresh.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt_auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @Post('login')
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response): Promise<ResponseDto> {
        try {
            const user = await this.authService.validateUser(dto);
            const token = await this.authService.login(user);

            res.cookie('accessToken', token.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Set secure flag in production
                maxAge: 15 * 60 * 1000, // 15 minutes
            });

            return {
                status: "success",
                responseCode: 200,
                message: "Login Successful",
                data: token
            };
        } catch (error) {
            if (error instanceof Error && error.message === 'Invalid credentials') {
                return {
                    status: "error",
                    responseCode: 401,
                    message: "Invalid credentials",
                    data: null
                };
            }
            return {
                status: "error",
                responseCode: 500,
                message: "Internal Server Error",
                data: null
            };
        }
    }

    @Public() 
    @UseGuards(RefreshJwtAuthGuard)
    @Post('refresh')
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<ResponseDto> {
        const user = req.user as any; // { sub, username, roles }
        const tokens = await this.authService.rotateTokens({ id: user.sub, username: user.username, roles: user.roles } as any);

        res.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true, secure: true, sameSite: 'strict', path: '/auth',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { status: 'success', responseCode: 200, message: 'Token Rotated', data: { accessToken: tokens.accessToken } };
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response): Promise<ResponseDto> {
        res.clearCookie('refresh_token', { path: '/auth' });
        return { status: 'success', responseCode: 200, message: 'Logged out', data: null };
    }
}
