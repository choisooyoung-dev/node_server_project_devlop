import { ProductsService } from "../services/products.service.js";
import { productSchemaValidation } from "../lib/schema-validation.js";

export class ProductsController {
    productService = new ProductsService();

    // 상품 글 목록 조회
    getAllProducts = async (req, res, next) => {
        try {
            const proucts = await this.productService.findAllProducts();
            return res.status(200).json({ data: proucts });
        } catch (err) {
            next(err);
        }
    };

    // 게시글 상세 조회
    getDetailProduct = async (req, res, next) => {
        try {
            const { productId } = req.params;

            const product = await this.productService.findDetailProduct(
                productId
            );

            return res.status(200).json({ data: product });
        } catch (err) {
            next(err);
        }
    };

    // 게시글 생성
    createProduct = async (req, res, next) => {
        try {
            const { userId } = res.locals.user;

            const { productName, price, productContent } =
                await productSchemaValidation.validateAsync(req.body);

            const createdProduct = await this.productService.createProduct(
                userId,
                productName,
                price,
                productContent
            );

            return res.status(201).json({ data: createdProduct });
        } catch (err) {
            next(err);
        }
    };

    updateProuct = async (req, res, next) => {
        try {
            const { productId } = req.params;
            const { userId } = res.locals.user;
            const { productName, price, status, productContent } =
                await productSchemaValidation.validateAsync(req.body);

            const updatedProduct = await this.productService.updateProduct(
                productId,
                userId,
                productName,
                price,
                status,
                productContent
            );

            return res
                .status(200)
                .json({ message: "수정 성공", data: updatedProduct });
        } catch (err) {
            next(err);
        }
    };

    deleteProduct = async (req, res, next) => {
        try {
            const { productId } = req.params;
            const { userId } = res.locals.user;

            const deletedProduct = await this.productService.deleteProduct(
                productId,
                userId
            );

            return res.status(200).json({ message: "게시글 삭제 성공" });
        } catch (err) {
            next(err);
        }
    };
}
