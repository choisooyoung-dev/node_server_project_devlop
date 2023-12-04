import { prisma } from "../utils/prisma/index.js";

export class ProductsRepository {
    // 게시글 목록 조회
    findAllProducts = async () => {
        const products = await prisma.products.findMany();

        return products;
    };

    // 게시글 생성
    createProduct = async (userId, productName, price, productContent) => {
        const createProduct = await prisma.products.create({
            data: {
                UserId: +userId,
                productName,
                price,
                productContent,
            },
        });
        return createProduct;
    };

    // 게시글 수정
    updateProduct = async (
        productId,
        productName,
        price,
        status,
        productContent
    ) => {
        const updatedProduct = await prisma.products.update({
            where: { productId: +productId },
            data: {
                productName,
                price,
                status,
                productContent,
            },
        });
        return updatedProduct;
    };

    // 게시글 삭제
    deleteProduct = async (productId) => {
        const deletedProduct = await prisma.products.delete({
            where: {
                productId: +productId,
            },
        });

        return deletedProduct;
    };
}
