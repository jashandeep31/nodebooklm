import { Router } from "express";
import { userLogin, userSignUp } from "../controllers/user.controller";

const router = Router();

router.route("/signup").post(userSignUp);
router.route("/login").post(userLogin);

export default router;
