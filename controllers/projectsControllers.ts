import { Request, Response, NextFunction } from "express";


export function getAllProjects(req: Request, res: Response, next: NextFunction) {
    console.log('get all projects')
    res
        .status(200)
        .json(
            {
                status: "Success",
                data: {
                    projects: [
                        {
                            "id": 1,
                            name: "Create Project Management Tool"
                        }
                    ]
                }
            }
        )
    ;
}