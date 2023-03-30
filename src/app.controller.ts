import { AppService } from './app.service';
import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private healthCheck: HealthCheckService,
    private mongooseHealth: MongooseHealthIndicator,
  ) {}

  @ApiOperation({
    summary: 'Helth checkup',
    description: 'This api used for check service is running or not.',
  })
  @Get('health')
  @HealthCheck()
  getHealth(): Promise<HealthCheckResult> {
    return this.healthCheck.check([
      () => this.mongooseHealth.pingCheck('mongoDB'),
    ]);
  }
}
