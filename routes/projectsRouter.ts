import {Router} from "express";
import {
    createProject,
    deleteProject,
    getCustomerProjects,
    getOneProject,
    updateProject
} from "../controllers/projectsControllers";
import {body, param} from "express-validator";

const router: Router = Router();

router.route('/:customerId')
    .get(getCustomerProjects)
    .post(createProject)

router.route('/:projectId')
    .get(
        [
            param('projectId')
                .trim()
                .notEmpty({ignore_whitespace: false})
                .isString(),
        ],
        getOneProject)
    .patch(
        [
            param('projectId')
                .trim()
                .notEmpty({ignore_whitespace: false})
                .isString(),
            body('name', "Project name is required")
                .isString()
                .trim()
                .notEmpty({ignore_whitespace: false}),
            body('customerId')
                .trim()
                .isString()
                .notEmpty({ignore_whitespace: false})
        ],
        updateProject)
    .delete(
        [
            param('projectId')
                .trim()
                .notEmpty({ignore_whitespace: false})
                .isString(),
        ],
        deleteProject)


export default router;