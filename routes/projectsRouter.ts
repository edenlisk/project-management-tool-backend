import { Router } from "express";
import { getAllProjects } from "../controllers/projectsControllers";

const router: Router = Router();

router.route('/:userId')
    .get(getAllProjects)


export default router;