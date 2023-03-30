import { UserDocument } from './schemas/user.schema';
import { UserRepository } from './user.repository';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { add, Logger } from 'winston';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
const web3 = require('web3');
import 'dotenv/config';
import { addUserDto } from './dto/addUser.dto';
import bcrypt from "bcrypt";
import axios from 'axios';
import { createClient } from 'redis';
@Injectable()
export class UserService {
  private redisClient;
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private configService: ConfigService,
    @InjectSentry() private readonly sentryClient: SentryService,
  ) {
    this.redisClient = createClient({
      url: this.configService.get<string>('REDIS_URL')
    });
    this.redisClient.connect();
  }

  /**
   * @description Add new user
   * @param {AddUserDto} addUser
   * @returns {UserDocument} new User
   */
  async addNewUser(
    addUser: addUserDto,
  ): Promise<UserDocument> {
    try {
      const salt = await bcrypt.genSalt(10);
      addUser.password = await bcrypt.hash(addUser.password, salt);
      return await this.userRepository.create(addUser);
    } catch (error) {
      this.logger.error(
        `${UserService.name} addNewUser ${error}`,
      );
    }
  }

  /**
   * @description Fetch Weather from redis if not then fetch api and set to redis
   * @param {string} cityName
   */
  async fetchWeather(cityName: String) {
    try {
      const value = await this.redisClient.get(cityName);
      if (value) {
        return JSON.parse(value);
      } else {
        const data = await axios.get(`${this.configService.get<string>('WEATHER_API')}${cityName}`);
        await this.redisClient.set(cityName, JSON.stringify(data.data), 'EX', this.configService.get<Number>('REDIS_TTL'));
        return data.data;
      }
    } catch (error) {
      this.logger.error(`${UserService.name} fetchAllPastEvent ${error}`);
    }
  }
}
