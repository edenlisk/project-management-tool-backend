import {Request, Response, NextFunction} from "express";
import {isValidObjectId, Types} from "mongoose";
import MessageModel from "../models/messageModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";


export const addMessage = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const newMessage = await MessageModel.create(
        {
            chatId: req.body.chatId,
            senderId: req.body.senderId,
            message: req.body.message
        }
    )
    if (!newMessage) return next(new AppError("Unable to send message", 400));
    res
        .status(201)
        .json(
            {
                status: "Success",
                data: {
                    newMessage
                }
            }
        )
    ;
})

export const getMessages = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!isValidObjectId(req.params.chatId)) return next(new AppError("Unable to load messages for this chat", 400));
    const messages = await MessageModel.find({chatId: req.params.chatId});
    res
        .status(200)
        .json(
            {
                status: "Success",
                data: {
                    messages
                }
            }
        )
    ;
})
