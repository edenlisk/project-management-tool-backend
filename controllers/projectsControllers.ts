import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import ProjectsModel from "../models/projectsModel";
import AppError from "../utils/appError";
import TasksModel from "../models/tasksModel";
import {isValidObjectId} from "mongoose";


export const getCustomerProjects = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const isCustomerIdValid = isValidObjectId(req.params.customerId);
    if (!isCustomerIdValid) return next(new AppError("Cannot find projects for selected customer's projects", 401));
    const projects = await ProjectsModel.find({customerId: req.params.customerId})
        .populate('teamMembers');
    res
        .status(200)
        .json(
            {
                status: "Success",
                data: {
                    projects
                }
            }
        )
    ;
})

export const getOneProject = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const project = await ProjectsModel.findById(req.params.projectId);
    if (!project) return next(new AppError("Selected project no longer exists!", 401));
    const tasks = await TasksModel.find({projectId: project._id});
    res
        .status(200)
        .json(
            {
                status: "Success",
                data: {
                    project: {...project, tasks}
                }
            }
        )
    ;
})

export const createProject = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const project = await ProjectsModel.create(
        {
            name: req.body.name,
            teamMembers: req.body.teamMembers,
            customerId: req.body.customerId,
            status: req.body.status,
            startDate: req.body.startDate,
            dueDate: req.body.dueDate
        }
    )
    res
        .status(202)
        .json(
            {
                status: "Success",
                data: {
                    project
                }
            }
        )
    ;
})

export const updateProject = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const isProjectIdValid = isValidObjectId(req.params.projectId);
    const project = await ProjectsModel.findById(req.params.projectId);
    if (!isProjectIdValid || !project) return next(new AppError("Selected project was not found!", 400));
    if (req.body.name) project.name = req.body.name;
    // if (req.body.tasks) project.tasks = req.body.tasks;
    if (req.body.teamMembers) project.teamMembers = req.body.teamMembers;
    if (req.body.status) project.status = req.body.status;
    if (req.body.dueDate) project.dueDate = req.body.dueDate;
    await project.save({validateModifiedOnly: true});
    res
        .status(202)
        .json(
            {
                status: "Success"
            }
        )
    ;
})

export const deleteProject = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> =>   {
    const project = await ProjectsModel.findByIdAndDelete(req.params.projectId);
    if (!project) return next(new AppError("Something went wrong", 400));
    res
        .status(204)
        .json(
            {
                status: "Success"
            }
        )
    ;
})
