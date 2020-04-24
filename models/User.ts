import { Schema, model} from 'mongoose';
import {User} from "../types/interfaces/User";

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

const User = model<User>('user', UserSchema);

export default User;