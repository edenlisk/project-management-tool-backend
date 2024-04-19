import { Router } from "express";
import { createChat, userChats, findChat } from "../controllers/chatControllers";

const router = Router();


router.route('/')
    .post(createChat)


router.route('/:userId')
    .get(userChats)

router.route('/:chatId')
    .get(findChat)


export default router;