import jwt from "jsonwebtoken";
import {
    TokenNotExistError,
    TokenTypeMismatchError,
    TokenUserNotExistError,
} from "../lib/error-lists.js";
import { prisma } from "../utils/prisma/index.js";
import { Prisma } from "@prisma/client";

export default async (req, res, next) => {
    try {
        const { authorization } = req.cookies;

        // 토큰 값 받지 않았을 때, 로그인 필요 시
        if (!authorization) {
            const err = new TokenNotExistError();
            throw err;
        }

        const [tokenType, token] = authorization.split(" ");
        // 토큰 타입이 일치하지 않을 때
        if (tokenType !== "Bearer") {
            const err = new TokenTypeMismatchError();
            throw err;
        }
        const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
        const userId = decodedToken.userId;
        const user = await prisma.users.findUnique({ where: { userId } });

        // 토큰 사용자가 존재하지 않을 때
        if (!user) {
            const err = new TokenUserNotExistError();
            throw err;
        }
        // console.log("res.locals.user => ", res.locals.user);
        res.locals.user = user;
        next();
    } catch (err) {
        next(err);
    }
};
