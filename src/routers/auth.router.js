import express from "express";
import dotenv from "dotenv";
import authMiddleware from "../middlewares/auth-middleware.js";
import { AuthController } from "../controllers/auth.controller.js";

dotenv.config();

const router = express.Router();

const authController = new AuthController();

// user login
router.post("/login", authController.login);

// logout
router.get("/logout", authMiddleware, authController.logout);

export default router;
