import * as http from 'node:http';

import express, {Express, NextFunction, Request, Response} from 'express';
import {DependencyContainer} from 'tsyringe';
import swaggerUi from 'swagger-ui-express';

import ParameterDefinition, {ParameterType} from '@/infrastructure/parameter-definition';
import {ControllerClass} from '@/infrastructure/controller-class';
import RouteDefinition from '@/infrastructure/route-definition';
import {METADATA_KEYS} from '@/infrastructure/metadata-keys';
import HttpRequest from '@/infrastructure/http-request';
import Http from '@/infrastructure/http';

import {swaggerSpec} from '@/shared/config/swagger';
import {HttpMethod} from '@/infrastructure/http-method';
import {SuccessResponse} from '@/infrastructure/api-response';

export default class ExpressAdapter implements Http {
    private readonly app: Express;
    private _container: DependencyContainer;

    constructor(container: DependencyContainer) {
        this._container = container;
        this.app = express();
        this.app.use(express.json());
        this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    };

    registerControllers(controllers: ControllerClass[]): void {
        for (const ControllerClass of controllers) {
            const prefix = Reflect.getMetadata(METADATA_KEYS.controllerPrefix, ControllerClass) ?? '';
            this.registerRoutes(prefix, ControllerClass);
        }
    };

    private registerRoutes(prefix: string, ControllerClass: ControllerClass) {
        const routes: RouteDefinition[] = Reflect.getMetadata(METADATA_KEYS.routes, ControllerClass) ?? [];
        if (!routes) return;
        const controllerInstance: ControllerClass = this._container.resolve(ControllerClass);
        for (const route of routes) {
            const path = prefix + route.path;
            const expressHandler: Function = controllerInstance[route.propertyKey].bind(controllerInstance);
            const parameterDefinitionsList: ParameterDefinition[] = Reflect.getMetadata(METADATA_KEYS.routeParams, ControllerClass, route.propertyKey);
            this.registerRoute(path, expressHandler, route, parameterDefinitionsList);
        }
    };

    private registerRoute(path: string, handler: Function, route: RouteDefinition, parameterDefinitionsList: ParameterDefinition[] = []) {
        this.app[route.method](path, async (request: Request, response: Response, next: NextFunction) => {
            try {
                const httpRequest: HttpRequest = {
                    headers: request.headers,
                    params: request.params,
                    body: request.body,
                };
                const parameterValues: any[] = this.getRouteParameters(parameterDefinitionsList, httpRequest);
                const output: SuccessResponse = await handler(...parameterValues);
                response.status(output.code ?? 200).json({data: output.data ?? output});
            } catch (error) {
                next(error);
            }
        });
    }

    private getRouteParameters(parameterDefinitionsList: ParameterDefinition[], httpRequest: HttpRequest<any, any>) {
        const parameterValues: any[] = new Array(parameterDefinitionsList.length);
        for (const {parameterIndex, type, name} of parameterDefinitionsList) {
            if (type === ParameterType.PARAMS) parameterValues[parameterIndex] = name ? httpRequest.params[name]: httpRequest.params;
            if (type === ParameterType.BODY) parameterValues[parameterIndex] = name ? httpRequest.body[name]: httpRequest.body;
        }
        return parameterValues;
    };

    useErrorMiddleware(middleware: (error: Error, req: Request, res: Response, next: NextFunction) => void) {
        this.app.use(middleware);
    };

    getInstance(): Express {
        return this.app;
    };

    listen(port: number, callback?: (error?: Error) => void): http.Server {
        return this.app.listen(port, callback);
    };

    route(method: HttpMethod, path: string, callback: Function): void {
        this.app[method](path, async function (request: Request, response: Response, nextFunction) {
            const output: any = await callback(request, response, nextFunction);
            response.json(output);
        });
    };

    on(method: HttpMethod, path: string, callback: Function): void {
        this.app[method](path, async function (request: Request, response: Response) {
            const output: any = await callback(request.params, request.body);
            response.json(output);
        });
    };

};

