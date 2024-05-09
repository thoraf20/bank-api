import { Router } from "express";
import { forgotPasswordHandler, loginHandler, registerHandler, resetPasswordHandler, verifyUserAccountHandler } from "./src/controllers/auth.controller";
import { setPinHandler, updatePinHandler, updateUserDataHandler } from "./src/controllers/user.controller";

const router = Router();

router.post("/auth/register", registerHandler);
router.post("/auth/verify/email", verifyUserAccountHandler);
router.post("/auth/login", loginHandler);
router.post("/auth/forgot/password", forgotPasswordHandler);
router.post("/auth/reset/password", resetPasswordHandler);

router.patch("/user/set_pin", setPinHandler);
router.patch("/user/update_pin", updatePinHandler);
router.patch("/user/data", updateUserDataHandler);

export default router