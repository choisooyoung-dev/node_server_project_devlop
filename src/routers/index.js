import express from "express";
import AuthRouter from "./auth.router.js";
import UsersRouter from "./users.router.js";
import ProductsRouter from "./products.router.js";

const router = express.Router();

router.use("/auth", AuthRouter);
router.use("/products", ProductsRouter);
router.use("/users", UsersRouter);

export default router;
