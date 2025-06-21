import {HTTPMethod} from '@/infrastructure/http-method';

export default class RouteDefinition {
    constructor( readonly path: string, readonly propertyKey: string, readonly method: HTTPMethod ) {
    };
};
