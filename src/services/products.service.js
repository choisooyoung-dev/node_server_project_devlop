import { ProductsRepository } from "../repositories/products.repository.js";
import { ProductNotExistError, UnauthUserError } from "../lib/error-lists.js";

export class ProductsService {
    productsRepository = new ProductsRepository();

    // 게시글 목록 조회
    findAllProducts = async () => {
        const products = await this.productsRepository.findAllProducts();

        if (!products) {
            const error = new ProductNotExistError();
            throw error;
        }

        return products.map((product) => {
            return {
                productId: product.productid,
                UserId: product.UserId,
                productName: product.productName,
                price: product.price,
                status: product.status,
                productContent: product.productContent,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
            };
        });
    };

    // 게시글 상세 조회
    findDetailProduct = async (productId) => {
        const product = await this.productsRepository.findDetailProduct(
            productId
        );

        if (!product) {
            const error = new ProductNotExistError();
            throw error;
        }

        return {
            productId: product.productId,
            productName: product.productName,
            price: product.price,
            status: product.status,
            productContent: product.productContent,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        };
    };

    // 게시글 생성
    createProduct = async (userId, productName, price, productContent) => {
        const createdProduct = await this.productsRepository.createProduct(
            userId,
            productName,
            price,
            productContent
        );

        return {
            productId: createdProduct.productId,
            productName: createdProduct.productName,
            price: createdProduct.price,
            status: createdProduct.status,
            productContent: createdProduct.productContent,
            createdAt: createdProduct.createdAt,
            updatedAt: createdProduct.updatedAt,
        };
    };

    // 게시글 수정
    updateProduct = async (
        productId,
        userId,
        productName,
        price,
        status,
        productContent
    ) => {
        const product = await this.productsRepository.findDetailProduct(
            productId,
            userId
        );

        if (!product) {
            const error = new ProductNotExistError();
            throw error;
        }
        if (product.UserId !== userId) {
            const error = new UnauthUserError();
            throw error;
        }

        const updatedProduct = await this.productsRepository.updateProduct(
            productId,
            productName,
            price,
            status,
            productContent
        );

        return {
            productId: updatedProduct.productId,
            productName: updatedProduct.productName,
            price: updatedProduct.price,
            status: updatedProduct.status,
            productContent: updatedProduct.productContent,
            createdAt: updatedProduct.createdAt,
            updatedAt: updatedProduct.updatedAt,
        };
    };

    deleteProduct = async (productId, userId) => {
        const deleteProduct = await this.productsRepository.findDetailProduct(
            productId,
            userId
        );

        if (!deleteProduct) {
            const error = new ProductNotExistError();
            throw error;
        }
        if (deleteProduct.UserId !== userId) {
            const error = new UnauthUserError();
            throw error;
        }

        await this.productsRepository.deleteProduct(productId);
    };
}
