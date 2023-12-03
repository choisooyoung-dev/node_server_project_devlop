import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import usersRouter from "../src/routers/users.router.js";
import productsRouter from "../src/routers/products.router.js";
import { ErrorHandler } from "../src/middlewares/error-middleware.js";

const app = express();

// sequelize
//     .sync({ force: false })
//     .then(() => {
//         console.log("데이터베이스 연결됨.");
//     })
//     .catch((err) => {
//         console.error(err);
//     });

app.set("port", process.env.PORT || 3000);

app.use(morgan("dev")); // 로그
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false })); // uri 파싱
app.use("/api", [usersRouter, productsRouter]);

// Error Handler
app.use(ErrorHandler);

// 서버 실행
app.listen(app.get("port"), () => {
    console.log(app.get("port"), "번 포트에서 대기 중");
});
