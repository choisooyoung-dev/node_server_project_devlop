import express from "express";
import authMiddleware from "../middlewares/auth-middleware.js";
import { prisma } from "../utils/prisma/index.js";
import { Prisma } from "@prisma/client";
import {
    ProductsNotExistError,
    WrongPathError,
    ProductNotExistError,
    UnauthUserError,
} from "../lib/error-lists.js";
import { productSchemaValidation } from "../lib/schema-validation.js";
import { ProductsController } from "../controllers/products.controller.js";

const productsController = new ProductsController();
const router = express.Router();

// 상품 글 생성
router.post("/new", authMiddleware, productsController.createProduct);

// 상품 글 목록 조회
router.get("/", productsController.getAllProducts);

// 상품 상세 조회
router.get("/:productId", productsController.getDetailProduct);

// 상품 수정
router.put("/:productId", authMiddleware, productsController.updateProuct);

// 상품 삭제
router.delete("/:productId", authMiddleware, productsController.deleteProduct);

// if (!product) {
//     const error = new ProductNotExistError();
//     throw error;
// } else if (product.UserId !== userId) {
//     const error = new UnauthUserError();
//     throw error;
// }

export default router;
