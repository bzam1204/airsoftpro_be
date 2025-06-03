import http from "node:http";
import {Express} from "express";

export default interface Http {
  on(method: string, path: string, callback: Function): void;

  getInstance(): Express;

  listen(port: number, callback?: (error?: Error) => void): http.Server;
};
