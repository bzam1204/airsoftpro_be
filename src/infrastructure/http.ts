import {Express} from "express";
import http from "node:http";

export default interface Http {
    on(method: string, path: string, callback: Function): void;

    route(method: string, path: string, callback: Function): void;

    getInstance(): Express;

    listen(port: number, callback?: (error?: Error) => void): http.Server;
};
