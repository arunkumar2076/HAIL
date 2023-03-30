import { JwtPayload } from './strategy/jwt-payload.interface';
import { LoginDto } from './dto/login.dto';
import { AuthRepository } from './auth.repository';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import bcrypt from "bcrypt";
@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectSentry() private readonly sentryClient: SentryService,
  ) { }

  /**
   * @description generate JWT token
   * @param body LoginDto
   * @param req req
   * @returns JWT token string
   */
  async login(
    body: LoginDto,
  ): Promise<any> {
    try {
      const { email, password } = body;
      const userData = await this.authRepository.findOne({ email });
      const payload: JwtPayload = {
        email,
        id: userData._id
      };
      const result = await bcrypt.compare(password, String(userData.password));
      if (result) {
        const token: string = this.jwtService.sign(
          { ...payload },
          {
            secret: this.configService.get('JWT_SECRET_KEY'),
            expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
          },
        );
        return { data: token, status: 200 };
      } else {
        throw new HttpException('Invalid User', HttpStatus.UNAUTHORIZED);
      }

    } catch (error) {
      this.logger.error(`${AuthService.name} verify ${error}`);
      this.sentryClient.instance().captureException(error);
      throw new HttpException(error, HttpStatus.UNAUTHORIZED);
    }
  }

  
}
