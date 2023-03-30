import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  /**
   * @description It takes 1 parameters, loginDto, which are of type LoginDto respectively.The code calls the authService's verify method, passing in the loginDto parameters.
   * @returns authtoken
   */
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Auth Check',
    description: 'This API check token is valid or not.',
  })
  @ApiBearerAuth()
  @Get('/status')
  tokenCheck(@Req() req: Request) {
    return {
      statusCode: 200,
      error: null,
      message: 'ok',
      data: req['user']
    };
  }

  @ApiOperation({
    summary: 'Login ',
    description: 'return login token.',
  })
  @Post('/login')
  login(
    @Body() loginDto: LoginDto,
  ): Promise<{ data: string; }> {
    return this.authService.login(loginDto);
  }
}
