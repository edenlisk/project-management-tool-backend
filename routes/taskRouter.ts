import {Router} from "express";

import {createTask, deleteTask, getOneTask, updateTask} from "../controllers/tasksControllers";

const router = Router();

router.route('/')
    .post(createTask)

router.route('/:taskId')
    .get(getOneTask)
    .patch(updateTask)
    .delete(deleteTask)

export default router;