import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from '../../base/entities/base.entity';
import { Expose, Exclude } from 'class-transformer';
import { AuthProvidersEnum } from '../../auth/auth-providers.enum';
import { GENDER } from '../../customers/entities/customer.entity';

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
    sparse: true,
  })
  phoneNumber: string;

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
    type: Date,
  })
  birthday?: Date;

  @Prop({
    enum: ROLE,
    default: ROLE.USER,
  })
  role: ROLE;

  @Prop()
  province?: PROVINCES;

  @Prop()
  gender?: GENDER;

  @Prop()
  address?: string;

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

export enum PROVINCES {
  HANOI = 'Hà Nội',
  HAGIANG = 'Hà Giang',
  CAOBANG = 'Cao Bằng',
  BACKAN = 'Bắc Kạn',
  TUYENQUANG = 'Tuyên Quang',
  LAOCAI = 'Lào Cai',
  DIENBIEN = 'Điện Biên',
  LAICHAU = 'Lai Châu',
  SONLA = 'Sơn La',
  YENBAI = 'Yên Bái',
  HOABINH = 'Hòa Bình',
  THAINGUYEN = 'Thái Nguyên',
  LANGSON = 'Lạng Sơn',
  QUANGNINH = 'Quảng Ninh',
  BACGIANG = 'Bắc Giang',
  PHUTHO = 'Phú Thọ',
  VINHPHUC = 'Vĩnh Phúc',
  BACNINH = 'Bắc Ninh',
  HAIDUONG = 'Hải Dương',
  HAIPHONG = 'Hải Phòng',
  HUNGYEN = 'Hưng Yên',
  THAIBINH = 'Thái Bình',
  HANAM = 'Hà Nam',
  NAMDINH = 'Nam Định',
  NINHBINH = 'Ninh Bình',
  THANHHOA = 'Thanh Hóa',
  NGHEAN = 'Nghệ An',
  HATINH = 'Hà Tĩnh',
  QUANGBINH = 'Quảng Bình',
  QUANGTRI = 'Quảng Trị',
  THUATHIENHUE = 'Thừa Thiên Huế',
  DANANG = 'Đà Nẵng',
  QUANGNAM = 'Quảng Nam',
  QUANGNGAI = 'Quảng Ngãi',
  BINHDINH = 'Bình Định',
  PHUYEN = 'Phú Yên',
  KHANHHOA = 'Khánh Hòa',
  NINHTHUAN = 'Ninh Thuận',
  BINHTHUAN = 'Bình Thuận',
  KONTUM = 'Kon Tum',
  GIALAI = 'Gia Lai',
  DAKLAK = 'Đắk Lắk',
  DAKNONG = 'Đắk Nông',
  LAMDONG = 'Lâm Đồng',
  BINHPHUOC = 'Bình Phước',
  TAYNINH = 'Tây Ninh',
  BINHDUONG = 'Bình Dương',
  DONGNAI = 'Đồng Nai',
  BARIAVUNGTAU = 'Bà Rịa - Vũng Tàu',
  HOCHIMINH = 'Hồ Chí Minh',
  LONGAN = 'Long An',
  TIENGIANG = 'Tiền Giang',
  BENTRE = 'Bến Tre',
  TRAVINH = 'Trà Vinh',
  VINHLONG = 'Vĩnh Long',
  DONGTHAP = 'Đồng Tháp',
  ANGIANG = 'An Giang',
  KIENGIANG = 'Kiên Giang',
  CANTHO = 'Cần Thơ',
  HAUGIANG = 'Hậu Giang',
  SOCTRANG = 'Sóc Trăng',
  BACLIEU = 'Bạc Liêu',
  CAMAU = 'Cà Mau',
}
