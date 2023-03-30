import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import 'dotenv/config';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  /**
   *
   * @description get all wallet acording to where condition
   * @return {UserDocument[]}
   * @param {object} where
   * @param {number} skip
   * @param {number} perPage
   */
  async findWithPaggination(
    where: object,
    skip: number,
    perPage: number,
  ): Promise<UserDocument[]> {
    return await this.userModel
      .find(where)
      .skip(skip)
      .limit(perPage)
      .populate('compoundStrategies')
      .populate('loanCompoundingTarget')
      .populate('stabilityCompounding')
      .populate('stakingCompounding')
      .populate('loanCompoundingCustom.customStability')
      .populate('loanCompoundingCustom.customStaking')
      .exec();
  }

  /**
   * @description fetch all document depent on pipline
   * @param {Array} pipline
   * @returns {UserDocument[]}
   */
  async walletAggregate(pipline: any): Promise<any> {
    return await this.userModel.aggregate(pipline).exec();
  }

  async countDocuments(condition: object): Promise<number> {
    return await this.userModel.countDocuments(condition).exec();
  }

  /**
   * @description find document by id and update it
   * @param {string} id
   * @param {object} payload
   * @returns {UserDocument}
   */
  async findByIdAndUpdate(
    id: string,
    payload: object,
  ): Promise<UserDocument> {
    return await this.userModel
      .findByIdAndUpdate(id, payload, { new: true })
      .populate('compoundStrategies')
      .populate('loanCompoundingTarget')
      .populate('stabilityCompounding')
      .populate('stakingCompounding')
      .populate('loanCompoundingCustom.customStability')
      .populate('loanCompoundingCustom.customStaking')
      .exec();
  }

  /**
   * @description find document by condition and update it
   * @param {object} condition
   * @param {object} payload
   * @returns {UserDocument}
   */
  async findOneAndUpdate(
    condition: object,
    payload: object,
  ): Promise<UserDocument> {
    return await this.userModel
      .findOneAndUpdate(condition, payload, { new: true })
      .exec();
  }

  /**
   * @description create document for Wallet model and return
   * @param {object} payload
   * @returns {UserDocument}
   */
  async create(payload: object): Promise<UserDocument> {
    return await this.userModel.create(payload);
  }

  /**
   * @description find document from wallet by id
   * @param {string} id
   * @returns {UserDocument}
   */
  async findById(id: string): Promise<UserDocument> {
    return await this.userModel
      .findById(id)
      .populate('compoundStrategies')
      .populate('loanCompoundingTarget')
      .populate('stabilityCompounding')
      .populate('stakingCompounding')
      .populate('loanCompoundingCustom.customStability')
      .populate('loanCompoundingCustom.customStaking')
      .exec();
  }
}
