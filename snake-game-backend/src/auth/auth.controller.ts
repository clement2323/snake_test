import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() userData: any) {
    const newPlayer = await this.authService.register(userData);
    return {newPlayer };
  }

  @Post('login')
  async login(@Body() loginData: { username: string; password: string }) {
    const player = await this.authService.login(loginData.username, loginData.password);
    if (player) {
      return { player };
    }
    throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
  }
}