import {NextFunction, Response, Request} from "express";
import catchAsync from "../utils/catchAsync";
import TasksModel from "../models/tasksModel";
import AppError from "../utils/appError";
import {Result, ValidationError, validationResult} from "express-validator";
import {isValidObjectId} from "mongoose";


export const getOneTask = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const task = await TasksModel.findById(req.params.taskId);
    if (!task) return next(new AppError("Selected task was not found!", 400));
    res
        .status(200)
        .json(
            {
                status: "Success",
                data: {
                    task
                }
            }
        )
    ;
})

export const createTask = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const task = await TasksModel.create(
        {
            title: req.body.title,
            projectId: req.body.projectId,
            assignees: req.body.assignees,
            currentStatus: 'todo',
            priorityLevel: req.body.priorityLevel
        }
    )
    res
        .status(202)
        .json(
            {
                status: "Success",
                data: {
                    task
                }
            }
        )
    ;
})

export const updateTask = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors: Result<ValidationError> = validationResult(req);
    if (!errors.isEmpty()) {
        return;
    }
    const isTaskIdValid = isValidObjectId(req.params.taskId);
    if (!isTaskIdValid) return next(new AppError("Task was not found!", 400));
    const task = await TasksModel.findById(req.params.taskId);
    if (!task) return next(new AppError("Task was not found!", 400));
    if (req.body.title) task.title = req.body.title;
    if (req.body.assignees) task.assignees = req.body.assignees;
    if (req.body.startTime) task.startTime = req.body.startTime;
    if (req.body.endTime) task.endTime = req.body.endTime;
    if (req.body.currentStatus) task.currentStatus = req.body.currentStatus;
    if (req.body.priorityLevel) task.priorityLevel = req.body.priorityLevel;
    await task.save({validateModifiedOnly: true});
    res.status(201).json({status: "Success"});
})

export const deleteTask = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const isTaskIdValid = isValidObjectId(req.params.taskId);
    const deletedTask = await TasksModel.findByIdAndDelete(req.params.taskId);
    if (!isTaskIdValid || !deletedTask) return next(new AppError("Task is not found!, Try again", 400));
    res.status(204).json({status: "Success"});
})