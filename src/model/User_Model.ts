import mongoose, { Schema, Document, model } from 'mongoose';

// Define the User interface
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    isVerified: boolean;
    otp?: number | null;
    otpExpires?: Date | null;
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
            default: null,
        },
        otpExpires: {
            type: Date,
            default: null,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false, // Removes `__v` version key
    }
);

// Index to automatically expire documents with outdated OTPs (TTL index)
UserSchema.index({ otpExpires: 1 }, { expireAfterSeconds: 0 });

// Create the Mongoose model
const UserModel = model<IUser>('User', UserSchema);

export default UserModel;
