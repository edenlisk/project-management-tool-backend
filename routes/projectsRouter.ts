import { Router } from "express";
import { getAllProjects } from "../controllers/projectsControllers";

const router: Router = Router();

router.route('/')
    .get(getAllProjects)


export default router;