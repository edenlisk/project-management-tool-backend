import { Router } from "express";
import { body } from "express-validator";

import { signup, login, getAllUsers } from "../controllers/authController";
const router = Router();

router.route('/')
    .get(getAllUsers)


router.route('/signup')
    .post(
        [
            body('email')
            .notEmpty()
            .trim()
            .isEmail()
        ], signup)

router.route('/login')
    .post(login)

export default router;