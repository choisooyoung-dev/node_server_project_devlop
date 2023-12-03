import { AuthService } from "../services/auth.service.js";
import {
    userSchemaValidation,
    userLoginSchemaValidation,
} from "../lib/schema-validation.js";
import {
    EmailExistError,
    UsernameExistError,
    EmailNotExistError,
    PasswordMismatchError,
    UnauthUserError,
} from "../lib/error-lists.js";

export class AuthController {
    authService = new AuthService();

    // 로그인
    login = async (req, res, next) => {
        try {
            const { email, password } =
                await userLoginSchemaValidation.validateAsync(req.body);

            const user = await this.authService.login(email, password);
            console.log(user);

            if (!user.user) {
                const err = new EmailNotExistError();
                throw err;
            }

            if (!user.check) {
                const err = new PasswordMismatchError();
                throw err;
            }

            res.cookie("authorization", `Bearer ${user.token}`);

            return res.status(200).json({ message: "로그인 성공" });
        } catch (err) {
            next(err);
        }
    };

    logout = async (req, res, next) => {
        try {
            res.clearCookie("authorization");
            return res.status(200).json({
                message: "로그아웃 성공",
            });
        } catch (err) {
            next(err);
        }
    };
}
