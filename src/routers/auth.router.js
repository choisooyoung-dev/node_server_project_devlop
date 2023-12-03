import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import authMiddleware from "../middlewares/auth-middleware.js";
import bcrypt from "bcryptjs";
import { prisma } from "../utils/prisma/index.js";
import { Prisma } from "@prisma/client";
import {
    EmailExistError,
    UsernameExistError,
    EmailNotExistError,
    PasswordMismatchError,
    UnauthUserError,
} from "../lib/error-lists.js";
import {
    userSchemaValidation,
    userLoginSchemaValidation,
} from "../lib/schema-validation.js";

dotenv.config();

const router = express.Router();

// user login
router.post("/login", async (req, res, next) => {
    try {
        const { email, password } =
            await userLoginSchemaValidation.validateAsync(req.body);
        const user = await prisma.users.findFirst({ where: { email } });

        if (!user) {
            const error = new EmailNotExistError();
            throw error;
        }

        const check = await bcrypt.compare(password, user.password);

        if (!check) {
            const error = new PasswordMismatchError();
            throw error;
        }
        // 정보 JWT 생성
        const token = jwt.sign(
            {
                userId: user.userId,
            },
            process.env.TOKEN_KEY,
            { expiresIn: "12h" } // 만료시간 12시간
        );

        res.cookie("authorization", `Bearer ${token}`);
        // console.log("login=>", req.cookies);
        return res.status(200).json({ message: "로그인 성공" });
    } catch (error) {
        next(error);
    }
});

// logout
router.get("/logout", authMiddleware, (req, res, next) => {
    try {
        // console.log(req.cookies);
        res.clearCookie("authorization");
        return res.status(200).json({
            message: "로그아웃 성공",
        });
    } catch (error) {
        next(error);
    }
});

export default router;
