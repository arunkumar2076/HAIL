import { UserService } from './user.service';
import { User, UserDocument } from './schemas/user.schema';
import { UserRepository } from './user.repository';
import { AuthGuard } from '../auth/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Patch,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  UseGuards,
  Req,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import { Query } from '@nestjs/common/decorators';
import { Request } from 'express';
import { body } from 'express-validator';
import { addUserDto } from './dto/addUser.dto';
@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(
    public readonly userService: UserService,
    public readonly userRepository: UserRepository,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectSentry() private readonly sentryClient: SentryService,
  ) { }

  /**
   *
   * @description Store User 
   * @return User
   */
  @ApiOperation({
    summary: 'Store user ',
    description: 'This API helps to Add new user in DB',
  })
  @Post('/')
  async testIsAutomation(@Body() body: addUserDto): Promise<{ data: UserDocument; status: number }> {
    const data = await this.userService.addNewUser(body);
    return { data: data, status: 200 };
  }

  /**
   *
   * @description Store User 
   * @return User
   */
  @ApiOperation({
    summary: 'Store user ',
    description: 'This API helps to Add new user in DB',
  })
  @Get('/weather/:cityName')
  async weather(@Param('cityName') cityName: string): Promise<{ data: any; status: number }> {
    const data = await this.userService.fetchWeather(cityName);
    return { data: data, status: 200 };
  }

}
