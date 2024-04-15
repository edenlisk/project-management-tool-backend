import { Schema, InferSchemaType, model, Document } from "mongoose";
import isEmail from "validator/lib/isEmail";
import bcrypt from 'bcrypt';


export interface IUserModel extends Document{
    name: string;
    email: string;
    password: string;
    phoneNumber: String,
    verifyPassword(password: string): Promise<boolean>,
    // passwordConfirm: string;
    role?: 'admin' | 'project manager' | 'team member';
}

export const userSchema = new Schema<IUserModel>({
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
        enum: ['customer', 'admin'],
        default: 'customer'
    }
})

// type User = InferSchemaType<typeof userSchema>;

userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

// userSchema.method('verifyPassword', async function (candidatePassword: string) {
//     return await bcrypt.compare(candidatePassword, this.password);
// })

userSchema.methods.verifyPassword = async function (candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password);
}

export default model('User', userSchema);
