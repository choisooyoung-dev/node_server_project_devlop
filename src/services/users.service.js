import bcrypt from "bcryptjs";
import { UsersRepository } from "./../repositories/users.repository.js";
export class UsersService {
    usersRepository = new UsersRepository();

    signup = async (email, password, username) => {
        const salt = await bcrypt.genSalt(12);
        const hashPW = await bcrypt.hash(password, salt);
        const createdUser = await this.usersRepository.signup(
            email,
            hashPW,
            username
        );

        //const user = await this.usersRepository.

        return {
            email: createdUser.email,
            password: createdUser.password,
            username: createdUser.username,
        };
    };

    userInfo = async (userId) => {
        const user = await this.usersRepository.userInfo(userId);

        return user;
    };
}
