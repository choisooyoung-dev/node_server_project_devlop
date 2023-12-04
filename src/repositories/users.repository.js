import { prisma } from "../utils/prisma/index.js";

export class UsersRepository {
    signup = async (email, password, username) => {
        const createdUser = await prisma.users.create({
            data: { email, password, username },
        });

        return { createdUser };
    };

    userInfo = async (userId) => {
        const user = await prisma.users.findUnique({
            where: { userId },
        });

        return user;
    };
}
