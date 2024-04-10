import { Request, Response, NextFunction } from "express";
import User from '../models/usersModel';
import catchAsync from "../utils/catchAsync";


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