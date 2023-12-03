import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import router from "./routers/index.js";
import { ErrorHandler } from "../src/middlewares/error-middleware.js";

const app = express();

app.set("port", process.env.PORT || 3000);

app.use(morgan("dev")); // 로그
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false })); // uri 파싱
app.use("/api", router);

// Error Handler
app.use(ErrorHandler);

// 서버 실행
app.listen(app.get("port"), () => {
    console.log(app.get("port"), "번 포트에서 대기 중");
});
