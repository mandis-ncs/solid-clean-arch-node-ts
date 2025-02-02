import { Request, Response } from "express";
import { ListProductOutputDto, ListProductUsecase } from "../../../../../usecases/product/list/listProduct.usecase"
import { HttpMethod, Route } from "../route"

export type ListProductResponseDto = {
    products: {
        id: string
        name: string
        price: number
    }[]
}

export class LsitProductRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly listProductService: ListProductUsecase
    ) { }

    public static create(listProductService: ListProductUsecase) {
        return new LsitProductRoute(
            "products",
            HttpMethod.GET,
            listProductService
        )
    }

    public getHandler() {
        return async (request: Request, response: Response) => {
            const output = await this.listProductService.execute()

            const responseBody = this.present(output)

            response.status(200).json(responseBody).send
        }
    }

    public getPath(): string {
        return this.path
    }

    public getMethod(): HttpMethod {
        return this.method
    }

    private present(input: ListProductOutputDto): ListProductResponseDto {
        const response: ListProductResponseDto = {
            products: input.products.map((p) => ({
                id: p.id,
                name: p.name,
                price: p.price
            }))
        }
        return response
    }
}