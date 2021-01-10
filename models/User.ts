import {model, Schema} from 'mongoose'
import {IUser} from '../types/interfaces/IUser'

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  register_date: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  }
})

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc: any, ret: any) => {
    ret.id = ret._id
    delete ret._id
  }
})

const User = model<IUser>('user', UserSchema)

export default User
