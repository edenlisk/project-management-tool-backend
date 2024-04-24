import { Router } from "express";
import { body } from "express-validator";

import { signup, login, getAllUsers, forgotPassword, resetPassword} from "../controllers/authController";
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

router.route('/forgotPassword')
    .post(forgotPassword)

router.route('/resetPassword/:token')
    .patch(resetPassword)

export default router;