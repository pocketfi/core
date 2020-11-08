import {Document} from 'mongoose'

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  created: Date;
  resetPasswordToken: string;
  resetPasswordExpires: Date;
}
