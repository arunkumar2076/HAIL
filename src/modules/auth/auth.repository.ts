import { User, UserDocument } from '../user/schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import 'dotenv/config';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(User.name)
    private authModel: Model<UserDocument>,
  ) {}

  /**
   * @description findOne document from auth model and return
   * @param {object} condition
   * @returns {Auth}
   */
  async findOne(condition: object): Promise<UserDocument> {
    return await this.authModel.findOne(condition).exec();
  }

}
