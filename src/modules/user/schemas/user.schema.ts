import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';
export type UserDocument = User & Document;

@Schema({
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  toJSON: {
    virtuals: true,
    transform: function (doc: any, ret: any) {
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class User {

  @Prop({ required: true })
  firstName: mongooseSchema.Types.String;

  @Prop({ default: null })
  lastName: mongooseSchema.Types.String;

  @Prop({ required: true })
  email: mongooseSchema.Types.String;

  @Prop({ required: true })
  password: mongooseSchema.Types.String;

}

const userSchema = SchemaFactory.createForClass(User);
userSchema.virtual('id').get(function (this: UserDocument) {
  return this._id;
});
export { userSchema };
