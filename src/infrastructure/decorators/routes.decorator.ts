import RouteDefinition from '@/infrastructure/route-definition';
import {METADATA_KEYS} from '@/infrastructure/metadata-keys';
import {HttpMethod} from '@/infrastructure/http-method';

function createRouteDecorator(method: HttpMethod) {
    return function (path: string = '') {
        return function (target: any, propertyKey: string) {
            const routeDefinition = new RouteDefinition(path, propertyKey, method);
            if (!Reflect.hasMetadata(METADATA_KEYS.routes, target.constructor)) Reflect.defineMetadata(METADATA_KEYS.routes, [], target.constructor);
            const routeDefinitionList: RouteDefinition[] = Reflect.getMetadata(METADATA_KEYS.routes, target.constructor);
            routeDefinitionList.push(routeDefinition);
            Reflect.defineMetadata(METADATA_KEYS.routes, routeDefinitionList, target.constructor);
            return void 0;
        };
    };
}

export const Delete = createRouteDecorator(HttpMethod.Delete);
export const Patch = createRouteDecorator(HttpMethod.Patch);
export const Post = createRouteDecorator(HttpMethod.Post);
export const Put = createRouteDecorator(HttpMethod.Put);
export const Get = createRouteDecorator(HttpMethod.Get);
