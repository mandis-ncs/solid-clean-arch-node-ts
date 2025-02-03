import { Api } from "../api"
import express, { Express } from "express"
import { Route } from "./routes/route"

export class ApiExpress implements Api {

    private app: Express

    private constructor(routes: Route[]) {
        this.app = express()
        this.app.use(express.json())
        this.addRoutes(routes)
    }

    public static create(routes: Route[]) {
        return new ApiExpress(routes)
    }

    private addRoutes(routes: Route[]) {
        routes.forEach((r) => {
            const path = r.getPath()
            const method = r.getMethod()
            const handler = r.getHandler()

            this.app[method](path, handler)
        })
    }

    public start(port: number) {
        this.app.listen(port, () => {
            console.log(`Server running on port ${port}`)
            this.listRoutes()
        })
    }

    private listRoutes() {
        const routes = this.app._router.stack
            .filter((r: any) => r.route)
            .map((r: any) => {
                return {
                    path: r.route.path,
                    method: r.route.stack[0].method
                }
            })

        console.log(routes)
    }

}