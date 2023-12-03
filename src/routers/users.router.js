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

// user 생성
router.post("/signup", async (req, res, next) => {
    try {
        // const { email, password, username, confirmPassword } = req.body;
        const { email, password, username, confirmPassword } =
            await userSchemaValidation.validateAsync(req.body);
        const isExitUser = await prisma.users.findFirst({ where: { email } });
        const isExitUsername = await prisma.users.findFirst({
            where: { username },
        });

        if (isExitUser) {
            const error = new EmailExistError();
            throw error;
        }

        if (isExitUsername) {
            const error = new UsernameExistError();
            throw error;
        }

        if (confirmPassword !== password) {
            const error = new ConfirmPasswordMismatchError();
            throw error;
        }

        // if (password.length <= 5) {
        //     const error = new PasswordLengthError();
        //     throw error;
        // }

        const salt = await bcrypt.genSalt(12);

        const hashPW = await bcrypt.hash(password, salt);

        await prisma.users.create({
            data: { email, password: hashPW, username },
        });
        const user = await prisma.users.findFirst({
            where: { email },
            select: {
                userId: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        // status(201) 클라이언트 요청을 서버가 정상적으로 처리, 새로운 리소스 생김
        return res.status(201).json({ data: user });
    } catch (error) {
        //const error = new
        next(error);
    }
});

// read user detail
router.get("/:userId", authMiddleware, async (req, res, next) => {
    try {
        const paramUserId = req.params.userId;
        const { userId } = res.locals.user;
        // console.log(req.cookies);
        const user = await prisma.users.findFirst({
            where: { userId: +userId },
            select: {
                userId: true,
                email: true,
                username: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        // console.log(paramUserId, userId);
        if (Number(paramUserId) !== userId) {
            const error = new UnauthUserError();
            throw error;
        }

        return res.status(201).json({ data: user });
    } catch (error) {
        next(error);
    }
});

export default router;
