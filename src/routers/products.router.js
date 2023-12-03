import express from "express";
import authMiddleware from "../middlewares/auth-middleware.js";
import { prisma } from "../utils/prisma/index.js";
import { Prisma } from "@prisma/client";
const router = express.Router();
// const { Op } = require("sequelize");
import {
    ProductsNotExistError,
    WrongPathError,
    ProductNotExistError,
    UnauthUserError,
} from "../lib/error-lists.js";
import { productSchemaValidation } from "../lib/schema-validation.js";

// 상품 글 생성
router.post("/new", authMiddleware, async (req, res, next) => {
    try {
        const { userId } = res.locals.user;

        const { productName, productContent, price, status } =
            await productSchemaValidation.validateAsync(req.body);

        // if (!title || !content || price <= 0 || !status) {
        //     const error = new QuerySyntaxError();
        //     throw error;
        // }

        const product = await prisma.products.create({
            data: {
                UserId: userId,
                productName,
                productContent,
                price,
                status,
            },
        });

        return res.status(201).json({ data: product });
    } catch (error) {
        next(error);
    }
});

// 상품 글 목록 조회
router.get("/", async (req, res, next) => {
    try {
        // url querystring
        const queryData = req.query.sort;
        let sortWord = "desc";

        if (queryData === undefined || queryData.toLowerCase() === "desc") {
            sortWord = "desc";
        } else if (queryData.toLowerCase() === "asc") {
            sortWord = "desc";
        } else {
            const error = new WrongPathError();
            throw error;
        }

        const products = await prisma.products.findMany({
            select: {
                productId: true,
                productName: true,
                productContent: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: sortWord,
            },
        });

        if (!products) {
            const error = new ProductsNotExistError();
            throw error;
        }

        //console.log(products);
        return res.status(201).json({ data: products });
    } catch (error) {
        next(error);
    }
});

// 상품 상세 조회
router.get("/:productId", async (req, res, next) => {
    try {
        const { productId } = req.params;

        // 상품, 사용자 join
        const product = await prisma.products.findFirst({
            where: {
                productId: +productId,
            },
            select: {
                productName: true,
                productContent: true,
                status: true,
                price: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!product) {
            const error = new ProductNotExistError();
            throw error;
        }

        // console.log(product);
        return res.status(201).json({ data: product });
    } catch (error) {
        next(error);
    }
});

// 상품 수정
router.put("/:productId", authMiddleware, async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { userId } = res.locals.user;

        const { productName, productContent, price, status } =
            await productSchemaValidation.validateAsync(req.body);

        const product = await prisma.products.findUnique({
            where: {
                productId: +productId,
            },
            select: {
                UserId: true,
                productName: true,
                productContent: true,
                status: true,
                price: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!product) {
            const error = new ProductNotExistError();
            throw error;
        } else if (product.UserId !== userId) {
            const error = new UnauthUserError();
            throw error;
        }

        await prisma.products.update({
            where: { productId: +productId },
            data: {
                productName,
                productContent,
                price,
                status,
            },
        });

        const updatedProduct = await prisma.products.findUnique({
            where: { productId: +productId },
            select: {
                UserId: true,
                productName: true,
                productContent: true,
                price: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return res.status(201).json({ data: updatedProduct });
    } catch (error) {
        next(error);
    }
});

// 상품 삭제
router.delete("/:productId", authMiddleware, async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { userId } = res.locals.user;

        const product = await prisma.products.findUnique({
            where: { productId: +productId },
        });

        if (!product) {
            const error = new ProductNotExistError();
            throw error;
        } else if (product.UserId !== userId) {
            const error = new UnauthUserError();
            throw error;
        }

        // 삭제
        await prisma.products.delete({
            where: {
                productId: +productId,
            },
        });

        return res.status(200).json({ message: "상품이 삭제되었습니다." });
    } catch (error) {
        next(error);
    }
});

export default router;
