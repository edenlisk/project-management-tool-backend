import {Router} from "express";

import { addProjectDiscussion, addMembers } from "../controllers/discussionControllers";

const router = Router();

router.route('/')
    .post(addProjectDiscussion)


router.route('/:projectId')
    .patch(addMembers)


export default router;