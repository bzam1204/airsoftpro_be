import {Express} from 'express';
import http from 'node:http';

import {ControllerClass} from '@/infrastructure/controller-class';

export default interface Http {
    registerControllers(controllers: ControllerClass[]): void;
    getInstance(): Express;
    listen(port: number, callback?: (error?: Error) => void): http.Server;
    route(method: string, path: string, callback: Function): void;
    on(method: string, path: string, callback: Function): void;
};
