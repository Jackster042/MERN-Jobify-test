import { Router } from "express";
import { register, login, logout } from "../controllers/authController.js";
import {
  validateRegisterInput,
  validateLoginInput,
} from "../middleware/validationMiddleware.js";
const router = new Router();

router.get("/logout", logout);

router.post("/register", validateRegisterInput, register);
router.post("/login", validateLoginInput, login);

export default router;
