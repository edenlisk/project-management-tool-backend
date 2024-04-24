import { Schema, InferSchemaType, model, Document } from "mongoose";
import isEmail from "validator/lib/isEmail";
import bcrypt from 'bcrypt';
import crypto from "crypto";


export interface IUserModel extends Document{
    name: string;
    email: string;
    password: string;
    phoneNumber: String,
    verifyPassword(password: string): Promise<boolean>,
    createPasswordResetToken(): Promise<string>,
    passwordConfirm: string,
    role?: 'admin' | 'project manager' | 'team member',
    passwordChangedAt: Date,
    passwordResetToken: string | undefined,
    passwordResetExpires: Date | undefined,
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
        maxLength: 50,
        unique: true,
        required: [true, 'Please provide email address'],
        validate: [isEmail, "Please provide valid Email address"]
    },
    password: {
        type: String,
        minLength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        validate: {
            validator: function (this: IUserModel, value: string): boolean {
                return this.password === value;
            },
            message: "Passwords does not match"
        }
    },
    phoneNumber: {
        type: String,
        unique: true
    },
    role: {
        type: String,
        enum: ['project manager', 'admin', 'team member'],
        default: 'project manager'
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
}, {
    timestamps: true
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

userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number): boolean {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(String(this.passwordChangedAt.getTime() / 1000), 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
}

userSchema.methods.createPasswordResetToken = async function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000;
    await this.save({validateModifiedOnly: true});
    return resetToken;
}
export default model('User', userSchema);
