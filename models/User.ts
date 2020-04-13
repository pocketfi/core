import { Schema, model} from 'mongoose';
import {IUser} from "../interfaces/IUser";

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
    }
});

const User = model<IUser>('user', UserSchema);

export default User;