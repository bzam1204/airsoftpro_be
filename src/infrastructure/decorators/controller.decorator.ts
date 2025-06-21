import {METADATA_KEYS} from '@/infrastructure/metadata-keys';

export default function Controller(prefix: string = '/') {
    return function (target: any) {
        Reflect.defineMetadata(METADATA_KEYS.controllerPrefix, prefix, target);
        return void 0;
    };
};
