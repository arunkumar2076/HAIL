import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { devLogger, productionLogger } from './setup-logger';
import { envSchema } from './shared/env-config/index';
import { SentryModule } from '@ntegral/nestjs-sentry';
import * as Sentry from '@sentry/node';
import { TerminusModule } from '@nestjs/terminus';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { WinstonModule } from 'nest-winston';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
@Module({
  imports: [    
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envSchema,
    }),
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        new Sentry.init({
          dsn: configService.get('Sentry_DSN'),
          debug: true,
          environment: configService.get('ENV'),
        }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI'),
      }),
    }),
    WinstonModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        configService.get('ENV') !== 'production'
          ? devLogger
          : productionLogger,
      inject: [ConfigService],
    }),
    TerminusModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [ AppService],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(RateLimiterMiddleware)
  //     .exclude(
  //       { path: '/auth/*', method: RequestMethod.ALL },
  //       { path: '/wallet/test/is-automation', method: RequestMethod.ALL },
  //     )
  //     .forRoutes(
  //       {
  //         path: '/strategies/*',
  //         method: RequestMethod.ALL,
  //       },
  //       {
  //         path: '/compounding-targets/*',
  //         method: RequestMethod.ALL,
  //       },
  //       {
  //         path: '/wallet/:wallet',
  //         method: RequestMethod.GET,
  //       },
  //       {
  //         path: '/wallet/:wallet',
  //         method: RequestMethod.POST,
  //       },
  //       {
  //         path: '/wallet/:wallet',
  //         method: RequestMethod.PATCH,
  //       },
  //     );
  // }
}
