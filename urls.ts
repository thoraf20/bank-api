import { Router } from "express";
import { forgotPasswordHandler, loginHandler, registerHandler, resetPasswordHandler, verifyUserAccountHandler } from "./src/controllers/auth.controller";

const router = Router();

router.post("/register", registerHandler);
router.post("/verify/email", verifyUserAccountHandler);
router.post("/login", loginHandler);
router.post("/forgot/password", forgotPasswordHandler);
router.post("/reset/password", resetPasswordHandler);

export default router