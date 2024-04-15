import { Request, Response, NextFunction } from "express";
import User, {IUserModel} from '../models/usersModel';
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import jwt from "jsonwebtoken";


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
            password: req.body.password
        }
    )
    res
        .status(2002)
        .json(
            {
                status: "Success",
                data: {
                    newUser
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