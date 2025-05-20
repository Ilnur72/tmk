import { Body, Controller, Get, Post, Res } from '@nestjs/common';
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

  @Post()
  async staffLogin(@Body() body: any) {
    try {
      const data = await this.authService.staffLogin(body);
      return {
        success: true,
        data,
      };
    } catch (error) {
      throw error;
    }
  }
}
