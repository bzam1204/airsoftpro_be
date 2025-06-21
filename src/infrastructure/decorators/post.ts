import RouteDefinition from '@/infrastructure/route-definition';
import {METADATA_KEYS} from '@/infrastructure/metadata-keys';

export default function Post(path: string = '') {
    return function (target: any, propertyKey: string) {
        const routeDefinition = new RouteDefinition(path, propertyKey, 'post');
        if (!Reflect.hasMetadata(METADATA_KEYS.routes, target.constructor)) Reflect.defineMetadata(METADATA_KEYS.routes, [], target.constructor);
        const routeDefinitionList: RouteDefinition[] = Reflect.getMetadata(METADATA_KEYS.routes, target.constructor);
        routeDefinitionList.push(routeDefinition);
        Reflect.defineMetadata(METADATA_KEYS.routes, routeDefinitionList, target.constructor);
        return void 0;
    };
};
