import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateUserDto } from '../dto/create-user.dto';
import { CurrentUser } from '../decorators/user.decorator';
import { User } from '../entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@CurrentUser() user: User) {
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    return user;
  }
}
