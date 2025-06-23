import ExpressExecutionContext from '@/infrastructure/express-execution-context';

export interface CanActivate {
    canActivate(context: ExpressExecutionContext): Promise<boolean> | boolean;
}
