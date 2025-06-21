import ParameterDefinition, {ParameterType} from '@/infrastructure/parameter-definition';
import {METADATA_KEYS} from '@/infrastructure/metadata-keys';

export function createParameterDecorator(type: ParameterType) {
    return function (name?: string) {
        return function (target: any, propertyKey: string, parameterIndex: number) {
            const parameterDefinition = new ParameterDefinition(parameterIndex, propertyKey, type, name);
            const hasMetadata = () => Reflect.hasMetadata(METADATA_KEYS.routeParams, target.constructor, propertyKey);
            if (!hasMetadata()) Reflect.defineMetadata(METADATA_KEYS.routeParams, [], target.constructor, propertyKey);
            const parameters = Reflect.getMetadata(METADATA_KEYS.routeParams, target.constructor, propertyKey);
            parameters.push(parameterDefinition);
            Reflect.defineMetadata(METADATA_KEYS.routeParams, parameters, target.constructor, propertyKey);
        };
    };
}

export const Params = createParameterDecorator(ParameterType.PARAMS);
export const Body = createParameterDecorator(ParameterType.BODY);
