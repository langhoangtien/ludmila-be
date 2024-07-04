import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from '../../base/entities/base.entity';
import { Expose, Exclude } from 'class-transformer';
import { AuthProvidersEnum } from '../../auth/auth-providers.enum';

export type UserDocument = HydratedDocument<User>;
export enum ROLE {
  ADMIN = 'admin',
  USER = 'user',
  CLIENT = 'client',
}
export enum STATUS {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}
@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class User extends BaseEntity {
  id: string;
  @Prop({
    type: String,
    unique: true,
  })
  @Expose({ groups: ['me', 'admin'], toPlainOnly: true })
  email: string | null;

  @Exclude({ toPlainOnly: true })
  @Prop()
  password?: string;

  @Prop({
    type: String,
    unique: true,
  })
  phoneNumber?: string;

  @Exclude({ toPlainOnly: true })
  previousPassword?: string;

  @Expose({ groups: ['me', 'admin'], toPlainOnly: true })
  @Prop({
    default: AuthProvidersEnum.email,
  })
  provider: string;

  @Expose({ groups: ['me', 'admin'], toPlainOnly: true })
  @Prop({
    type: String,
    default: null,
  })
  socialId?: string | null;

  @Prop({
    type: String,
  })
  firstName: string | null;

  @Prop({
    type: String,
  })
  lastName: string | null;

  @Prop({
    type: String,
  })
  photo?: string | null;

  @Prop({
    enum: ROLE,
    default: ROLE.USER,
  })
  role: ROLE;

  @Prop({
    enum: STATUS,
    default: STATUS.INACTIVE,
  })
  status: STATUS;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('previousPassword').get(function () {
  return this.password;
});
UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.index({ 'role._id': 1 });

export const UserSchemaFactory = () => {
  const userSchema = UserSchema;
  return userSchema;
};
