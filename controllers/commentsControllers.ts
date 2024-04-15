import {Request, Response, NextFunction} from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import {isValidObjectId} from "mongoose";
import CommentsModel from "../models/commentsModel";



export const getTaskComments = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const isTaskIdValid = isValidObjectId(req.params.taskId);
    const taskComments = await CommentsModel.find({taskId: req.params.taskId});
    if (!isTaskIdValid || !taskComments) return next(new AppError("Comments for this task are not available!", 400));
    res
        .status(200)
        .json(
            {
                status: "Success",
                data: {
                    taskComments
                }
            }
        )
    ;
})

export const addComment = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void>=> {
    const isTaskIdValid = isValidObjectId(req.body.taskId);
    if (!isTaskIdValid) return next(new AppError("Something went wrong, please try again!", 400));
    const newComment = await CommentsModel.create(
        {
            userId: req.body.userId,
            taskId: req.body.taskId,
            commentText: req.body.commentText
        }
    )
    res
        .status(202)
        .json(
            {
                status: "Success",
                data: {
                    newComment
                }
            }
        )
    ;
})

