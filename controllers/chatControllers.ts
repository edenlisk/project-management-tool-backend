import {Request, Response, NextFunction} from "express";
import {isValidObjectId, Types} from "mongoose";
import catchAsync from "../utils/catchAsync";
import ChatModel from "../models/chatModel";
import AppError from "../utils/appError";


export const createChat = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const newChat = await ChatModel.create(
        {
            senderId: req.body.senderId,
            receiverId: req.body.receiverId
        }
    )
    if (!newChat) return next(new AppError("Unable to create new chat", 400));
    res
        .status(201)
        .json(
            {
                status: "Success",
                data: {
                    newChat
                }
            }
        )
    ;
})

export const userChats = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!isValidObjectId(req.params.userId)) return next(new AppError("Unable to load chats", 400));
    const chats = await ChatModel.find({senderId: req.params.userId});
    res
        .status(200)
        .json(
            {
                status: "Success",
                data: {
                    chats
                }
            }
        )
    ;
})

export const findChat = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!isValidObjectId(req.params.senderId) || !isValidObjectId(req.params.receiverId)) return next(new AppError("Unable to find chat!", 400));
    const chat = await ChatModel.findOne({$and: [{senderId: req.params.senderId}, {receiverId: req.params.receiverId}] });
    res
        .status(200)
        .json(
            {
                status: "Success",
                data: {
                    chat
                }
            }
        )
    ;
})