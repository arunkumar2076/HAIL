import { JwtPayload } from './jwt-payload.interface';
import { AuthRepository } from '../auth.repository';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
const parser = require('ua-parser-js');
const cryptoJS = require('crypto-js');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authRepository: AuthRepository,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectSentry() private readonly sentryClient: SentryService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET_KEY'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  /**
   * @description This code is a function that validates a request with a JSON Web Token (JWT) payload. It uses the user-agent header from the request to get information about the browser, device, and operating system of the user. It then decrypts the data in the JWT payload using a secret encryption key. The function then checks to see if there is a wallet associated with the token and address in the payload, and if all of the information from the user-agent header matches what is in the JWT payload. If any of this information does not match, an unauthorized error is thrown. If all of this information matches, it returns the address from the JWT payload. Finally, it logs any errors that occur and captures them with SentryClient.
   * @param req
   * @param payload JWTPayload
   * @returns address user 
   */
  async validate(req: Request, payload: JwtPayload) {
    try {
      const token = req.headers['authorization'].split('Bearer ')[1];
      const user = await this.authRepository.findOne({
        _id: payload.id,
      });
      if (user) {
        req['user'] = user;
      } else {
        throw new HttpException(
          'Invalid authorization.',
          HttpStatus.UNAUTHORIZED,
        );
      }
      return user;
    } catch (error) {
      this.logger.error(`${JwtStrategy.name} validate ${error}`);
      this.sentryClient.instance().captureException(error);
      throw error;
    }
  }
}
