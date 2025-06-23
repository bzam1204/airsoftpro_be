import {HttpMethod} from '@/infrastructure/http-method';

export default class RouteDefinition {
    constructor(readonly path: string, readonly propertyKey: string, readonly method: HttpMethod) {
    };
};
