import { prisma } from "../utils/prisma/index.js";

export class UsersRepository {
    signup = async (email, password, username) => {
        // const isExitUser = await prisma.users.findFirst({ where: { email } });
        // const isExitUsername = await prisma.users.findFirst({
        //     where: { username },
        // });

        const createdUser = await prisma.users.create({
            data: { email, password, username },
        });

        // const newUser = await prisma.users.findFirst({
        //     where: { email },
        //     select: {
        //         userId: true,
        //         email: true,
        //         createdAt: true,
        //         updatedAt: true,
        //     },
        // });

        return { createdUser };
    };

    userInfo = async (userId) => {
        const user = await prisma.users.findUnique({
            where: { userId },
        });

        return user;
    };
}
