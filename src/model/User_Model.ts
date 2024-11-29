import mongoose, { Schema, Document, model } from 'mongoose';

// Define the User interface
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    is_verify: boolean;
    otp: number;
    createdAt?: Date;
    updatedAt?: Date;
}

// Define the schema for User
const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        otp: {
            type: Number,
            required: true
        },
        is_verify: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Create the Mongoose model
const UserModel = model<IUser>('User', UserSchema);

export default UserModel;
