import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginUserDto } from './dto/login-user.dto';
import express from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: express.Response) {
    const result = await this.authService.signIn(loginDto);

    response.cookie('jwt', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 4 * 60 * 60 * 1000, // (4h)
    });

    return { message: 'Connexion réussie' };
  }

  @Post('login-user')
  async loginUser(@Body() loginUserDto: LoginUserDto, @Res({ passthrough: true }) response: express.Response) {
    const result = await this.authService.signInUser(loginUserDto);

    response.cookie('jwt', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1 * 60 * 60 * 1000, // (1h)
    });

    return { 
      message: 'Authentification réussie', 
      user: result.user 
    };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: express.Response) {
    response.clearCookie('jwt');
    
    return { message: 'Déconnexion réussie' };
  }
}
