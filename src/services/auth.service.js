import { AuthRepository } from "../repositories/auth.repository.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { EmailNotExistError } from "../lib/error-lists.js";

export class AuthService {
    authRepository = new AuthRepository();

    login = async (email, password) => {
        const user = await this.authRepository.login(email, password);

        if (!user) {
            const err = new EmailNotExistError();
            throw err;
        }

        const check = bcrypt.compareSync(password, user?.password);

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
