import { AuthRepository } from "../repositories/auth.repository.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
    EmailExistError,
    UsernameExistError,
    EmailNotExistError,
    PasswordMismatchError,
    UnauthUserError,
} from "../lib/error-lists.js";

export class AuthService {
    authRepository = new AuthRepository();

    login = async (email, password) => {
        const user = await this.authRepository.login();
        const check = await bcrypt.compare(password, user.password);

        // 정보 JWT 생성
        const token = jwt.sign(
            {
                userId: user.userId,
            },
            process.env.TOKEN_KEY,
            { expiresIn: "12h" } // 만료시간 12시간
        );

        return { user, check, token };
    };
}
