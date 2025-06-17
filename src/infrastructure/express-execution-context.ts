import {Request, Response} from "express";

import {ExecutionContext} from "@/infrastructure/execution-context";

export default class ExpressExecutionContext implements ExecutionContext<Request, Response> {

    constructor(
        private readonly request: Request,
        private readonly response: Response) {
    };

    getResponse() {
        return this.response;
    };

    getRequest() {
        return this.request;
    };

};
