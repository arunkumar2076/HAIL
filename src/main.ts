import { AppModule } from './app.module';
import { setupSwagger } from './setup-swagger';
import { HttpExceptionFilter } from './shared/providers/HttpExceptionFilter';
import { setHeader } from './setHeader';
import { validateOrigin } from './validateOrigin';
import { hppProtector } from './hppProtector';
import { NestFactory } from '@nestjs/core';
import {
  crossOriginEmbedderPolicy,
  crossOriginOpenerPolicy,
  crossOriginResourcePolicy,
  dnsPrefetchControl,
  expectCt,
  hidePoweredBy,
  ieNoOpen,
  noSniff,
  originAgentCluster,
  permittedCrossDomainPolicies,
  referrerPolicy,
  xssFilter,
} from 'helmet';
import xss from 'xss-clean';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import cors = require('cors');
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  const configService = app.get<ConfigService>(ConfigService);
  app.setGlobalPrefix('/api/v1');
  app.use(bodyParser.urlencoded({ limit: '5KB' }));
  app.use(bodyParser.json({ limit: '5KB' }));
  app.use(bodyParser.text({ limit: '5KB' }));
  const originAllow = process.env.ORIGIN_ALLOW;
  const whitelist = [originAllow];
  if (process.env.ENV == 'dev' || process.env.ENV == 'staging') {
    whitelist.push('');
  }
  app.use(setHeader);
  app.enableCors({
    origin: whitelist,
    methods: 'GET, POST, PATCH',
    credentials: true,
  });
  app.use(cors(validateOrigin));
  app.use(hppProtector);
  app.use(crossOriginEmbedderPolicy());
  app.use(crossOriginOpenerPolicy());
  app.use(crossOriginResourcePolicy());
  app.use(dnsPrefetchControl());
  app.use(expectCt());
  app.use(hidePoweredBy());
  app.use(ieNoOpen());
  app.use(noSniff());
  app.use(originAgentCluster());
  app.use(
    permittedCrossDomainPolicies({
      permittedPolicies: 'by-content-type',
    }),
  );
  app.use(referrerPolicy());
  app.use(xssFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(validationErrors);
      },
    }),
  );
  app.use(xss());
  // app.use(requestIp.mw());
  if (!['production'].includes(configService.get('ENV'))) {
    setupSwagger(app);
  }

  const port = process.env.PORT;
  await app.listen(port);
  console.info(
    `server running on port ${port} origin ${configService.get(
      'ORIGIN_ALLOW',
    )} ENV ${configService.get('ENV')}`,
  );
}

bootstrap();
