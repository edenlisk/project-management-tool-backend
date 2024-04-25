import { Request, Response, NextFunction } from "express";
import User, {IUserModel} from '../models/usersModel';
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Email from "../utils/email";


const signToken = (id: string) => {
    return jwt.sign({id}, process.env.JWT_SECRET_KEY as string, {expiresIn: process.env.EXPIRES_IN});
}

const createSendToken = (user: IUserModel, statusCode: number, res: Response<any, Record<string, any>>) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + 10 + 20 * 60 * 60 * 1000),
        httpOnly: true,
        secure: false
    }
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);
    user.password = '';
    res
        .status(statusCode)
        .json(
            {
                status: "Success",
                token,
                data: {
                    user
                }
            }
        )
    ;
}

export const getAllUsers = catchAsync(async (req: Request, res: Response ) => {
    const users = await User.find();
    res
        .status(200)
        .json(
            {
                status: "Success",
                data: {
                    users
                }
            }
        )
    ;
})

export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const existingUser = await User.findOne({email: req.body.email.trim()});
    if (existingUser) return next(new AppError(`${req.body.email} email already exists in database`, 401));
    const newUser = await User.create(
        {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            phoneNumber: req.body.phoneNumber,
            role: req.body.role
        }
    )
    res
        .status(202)
        .json(
            {
                status: "Success",
                data: {
                    newUser: {...newUser, password: undefined}
                }
            }
        )
    ;
})

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) return next(new AppError("Please provide email and password", 400));
    const user = await User.findOne({email: email}).select("+password");
    if (!user || !(await user.verifyPassword(password))) {
        return next(new AppError("Invalid Email or Password", 401));
    }
    createSendToken(user, 200, res);
})

export const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // 1. Check if user with POSTed email exists
    const currentUser = await User.findOne({email: req.body.email.trim()});
    if (!currentUser) return next(new AppError("There is not user with this email", 404));
    // 2. Generate random token
    const resetToken = await currentUser.createPasswordResetToken();
    await currentUser.save({validateBeforeSave: false});
    // 3. Send it to user's email
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/librarians/${resetToken}`;
    // const message = `Forgot your password? Please click on the following link to reset it \n ${resetUrl} \n If you didn't create this request, Please ignore this email`;
    try {
        await new Email(currentUser, resetUrl).sendPasswordReset('passwordReset', 'Password Reset token');
        res
            .status(200)
            .json(
                {
                    status: "Success",
                    message: "Reset Link sent on your email"
                }
            )
    } catch (err) {
        currentUser.passwordResetExpires = undefined;
        currentUser.passwordResetToken = undefined
        await currentUser.save({validateBeforeSave: false});
        next(new AppError("There was an error with sending email. Please try again later", 500));
    }
})

export const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // 1. Get user based on token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const currentUser = await User.findOne(
        {
            passwordResetToken: hashedToken,
            passwordResetExpires: {$gt: Date.now()}
        }
    )
    // 2. If token has not expired, and there is the user then reset the password
    if (!currentUser) return next(new AppError("Invalid Token or has expired", 400));
    if (req.body.password) currentUser.password = req.body.password;
    if (req.body.passwordConfirm) currentUser.passwordConfirm = req.body.passwordConfirm;
    currentUser.passwordResetToken = undefined;
    currentUser.passwordResetExpires = undefined;
    await currentUser.save();
    // 3. Updated passwordChangedAt for the user -> done with pre('save') middleware

    // 4. Log the user in, send JWT
    currentUser.password = '';
    createSendToken(currentUser, 200, res);
})