import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import ProjectsModel from "../models/projectsModel";
import AppError from "../utils/appError";
import TasksModel from "../models/tasksModel";


export const getCustomerProjects = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    res
        .status(200)
        .json(
            {
                status: "Success",
                data: {
                    projects: [
                        {_id: 1, name: "Developing E-commerce website"},
                        {_id: 2, name: "Learning Data Structures"}
                    ]
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
            users: req.body.users,
            customerId: req.body.customerId,
            tasks: req.body.tasks
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
    const project = await ProjectsModel.findById(req.body.projectId);
    if (!project) return next(new AppError("Selected project was not found!", 401));
    if (req.body.name) project.name = req.body.name;
    await project.save({validateModifiedOnly: true});
    res
        .status(201)
        .json(
            {
                status: "Success"
            }
        )
    ;
})

export const deleteProject = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
