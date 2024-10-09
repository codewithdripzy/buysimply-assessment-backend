import { Router } from "express";
import { LoginAuthController, LogoutAuthController } from "../controllers/auth";

const authRouter = Router();

authRouter.route("/login").post(LoginAuthController);
authRouter.route("/logout").post(LogoutAuthController);

export default authRouter;