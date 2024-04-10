import { Schema, InferSchemaType, model } from "mongoose";
import isEmail from "validator/lib/isEmail";
import {NextFunction} from "express";
import bcrypt from 'bcrypt';


export interface UserSchema {
    name: string;
    email: string;
    password: string;
    phoneNumber: String,
    // passwordConfirm: string;
    role?: 'user' | 'admin';
}

export const userSchema = new Schema<UserSchema>({
    name: {
        type: String,
        minLength: 5,
        maxLength: 50,
        required: [true, 'Please provide your name']
    },
    email: {
        type: String,
        minLength: 5,
        maxLength: 20,
        required: [true, 'Please provide email address'],
        validate: [isEmail, "Please provide valid Email address"]
    },
    password: {
        type: String,
        minLength: 8,
        select: false
    },
    phoneNumber: {
        type: String,
        unique: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
})

// type User = InferSchemaType<typeof userSchema>;

// @ts-ignore
userSchema.pre("save", async function (next: NextFunction) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

userSchema.methods.verifyPassword = async function (candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password);
}

export default model<UserSchema>('User', userSchema);
