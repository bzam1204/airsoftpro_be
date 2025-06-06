import express, {Express} from "express";
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
    this.app[method](path, async function (req: any, res: any) {
      const output: any = await callback(req.params, req.body);
      res.json(output);
    });
  };

  listen(port: number, callback?: (error?: Error) => void): http.Server {
    return this.app.listen(port, callback);
  };

};

type HTTPMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';
