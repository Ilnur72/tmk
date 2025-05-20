import { Controller, Get, Render, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  // @Render('auth/index')
  async login(@Res() res: Response) {
    return res.render('auth/index', {
      layout: false,
    });
  }
}
