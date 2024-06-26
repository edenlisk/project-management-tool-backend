import {Request, Response, NextFunction} from "express";
import DiscussionModel from "../models/DiscussionModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import {isValidObjectId, Types,} from "mongoose";


export const addProjectDiscussion = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const isProjectIdValid = isValidObjectId(req.body.projectId);
    if (!isProjectIdValid) return next(new AppError("Something went wrong, Please try again!", 400));
    const newDiscussion = await DiscussionModel.create(
        {
            members: req.body.members,
            projectId: req.body.projectId
        }
    )
    res
        .status(200)
        .json(
            {
                status: "Success",
                data: {
                    newDiscussion
                }
            }
        )
    ;
})


export const addMembers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const isProjectIdValid = isValidObjectId(req.params.projectId);
    const projectDiscussion = await DiscussionModel.findOne({projectId: req.params.projectId});
    if (!isProjectIdValid || !projectDiscussion) return next(new AppError("Unable to complete the operation, Try again!", 400));
    if (req.body.members) {
        req.body.members.forEach((memberId: Types.ObjectId) => {
            if (!projectDiscussion.members.includes(memberId)) projectDiscussion.members.push(memberId);
        })
    }
    await projectDiscussion.save({validateModifiedOnly: true});
    res
        .status(200)
        .json(
            {
                status: "Success",
            }
        )
    ;
})

