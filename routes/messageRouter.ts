import { Router } from "express";
import { addMessage, getMessages } from '../controllers/messageControllers';
const router = Router();

router.route('/')
    .post(addMessage)

router.route('/:chatId')
    .get(getMessages)


export default router;