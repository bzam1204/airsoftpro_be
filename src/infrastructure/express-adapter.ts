import express, {Express, Request, Response} from "express";
import {swaggerSpec} from "@/shared/config/swagger";
import swaggerUi from 'swagger-ui-express';

import Http from "@/infrastructure/http";
import * as http from "node:http";

export default class ExpressAdapter implements Http {
    private readonly app: Express;

    constructor() {
        this.app = express();
        this.app.use(express.json());
        this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    };

    getInstance(): Express {
        return this.app;
    };

    on(method: HTTPMethod, path: string, callback: Function): void {
        this.app[method](path, async function (request: Request, response: Response) {
            const output: any = await callback(request.params, request.body);
            response.json(output);
        });
    };

    route(method: HTTPMethod, path: string, callback: Function): void {
        this.app[method](path, async function (request: Request, response: Response, nextFunction) {
            const output: any = await callback(request, response, nextFunction);
            response.json(output);
        });
    };

    listen(port: number, callback?: (error?: Error) => void): http.Server {
        return this.app.listen(port, callback);
    };

};

type HTTPMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';
