import { Request, Response, NextFunction } from "express";
import User from "../models/usersModel";
import catchAsync from "../utils/catchAsync";


export const getAllProjects = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

})