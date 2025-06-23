import {CanActivate} from '@/infrastructure/can-activate';

export type CanActivateClass = {new(...args: any[]): CanActivate};
