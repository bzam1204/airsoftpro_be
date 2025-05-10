import express from "express";

import Http from "@/infrastructure/http";

export default class ExpressAdapter implements Http {
  private readonly app: any;

  constructor() {
    this.app = express();
    this.app.use(express.json());
  };

  on(method: string, path: string, callback: Function): void {
    this.app[method](path, async function (req: any, res: any) {
      const output: any = await callback(req.params, req.body);
      res.json(output);
    });
  };

  listen(port: number, callback?: Function): void {
    this.app.listen(port, callback);
  };

};
