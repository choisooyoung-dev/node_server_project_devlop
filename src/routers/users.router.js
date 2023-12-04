import express from "express";
import dotenv from "dotenv";
import authMiddleware from "../middlewares/auth-middleware.js";
import { UsersController } from "../controllers/users.controller.js";
dotenv.config();

const router = express.Router();

const usersController = new UsersController();

// user 생성
router.post("/signup", usersController.signup);

// read user detail
router.get("/:userId", authMiddleware, usersController.userInfo);

export default router;
