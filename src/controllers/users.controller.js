import { UsersService } from "../services/users.service.js";
import {
    EmailExistError,
    UsernameExistError,
    EmailNotExistError,
    PasswordMismatchError,
    UnauthUserError,
} from "../lib/error-lists.js";
import { userSchemaValidation } from "../lib/schema-validation.js";

export class UsersController {
    userService = new UsersService();
    signup = async (req, res, next) => {
        try {
            const { email, password, username, confirmPassword } =
                await userSchemaValidation.validateAsync(req.body);

            const createdUser = await this.userService.signup(
                email,
                password,
                username
            );

            // if (isExitUser) {
            //     const error = new EmailExistError();
            //     throw error;
            // }

            // if (isExitUsername) {
            //     const error = new UsernameExistError();
            //     throw error;
            // }

            if (confirmPassword !== password) {
                const error = new ConfirmPasswordMismatchError();
                throw error;
            }
            return res.status(201).json({ data: email, username });
        } catch (err) {
            next(err);
        }
    };

    userInfo = async (req, res, next) => {
        try {
            const paramUserId = req.params.userId;
            const { userId } = res.locals.user;

            const user = await this.userService.userInfo(userId);

            // console.log(paramUserId, userId);
            if (Number(paramUserId) !== userId) {
                const error = new UnauthUserError();
                throw error;
            }

            return res.status(201).json({ data: user });
        } catch (err) {
            next(err);
        }
    };
}
