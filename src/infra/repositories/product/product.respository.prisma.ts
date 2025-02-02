import { PrismaClient } from "@prisma/client";
import { ProductGateway } from "../../../domain/product/gateway/product.gateway";
import { Product } from "../../../domain/product/entity/product";

export class ProductRepositoryPrisma implements ProductGateway {

    private constructor(private readonly prismaClient: PrismaClient) {}

    public static create(prismaClient: PrismaClient) {
        return new ProductRepositoryPrisma(prismaClient)
    }

    public async save(product: Product): Promise<void> {
        const data = {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: product.quantity
        }

        await this.prismaClient.product.create({
            data
        })
    }

    public async list(): Promise<Product[]> {
        const products = await this.prismaClient.product.findMany()

        const productsList = products.map((p) => {
            const product = Product.with({
                id: p.id,
                price: p.price,
                name: p.name,
                quantity: p.quantity
            })
            return product
        })
        return productsList
    }
}