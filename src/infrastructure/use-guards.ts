import {Request, Response, NextFunction} from "express";

import {CanActivateClass} from "@/infrastructure/can-activate-class";
import ExpressExecutionContext from "@/infrastructure/express-execution-context";

export default function UseGuards(...guards: CanActivateClass[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        //TODO? MELHORAR A ABSTRAÇÃO PARA DESACOPLAR DO EXPRESS
        descriptor.value = async function (request: Request, response: Response, next: NextFunction) {
            const executionContext = new ExpressExecutionContext(request, response);
            for (const Guard of guards) {
                const guardInstance = new Guard();
                const canActivate = await guardInstance.canActivate(executionContext);
                if (!canActivate) return response.status(403).json({
                    statusCode: 403,
                    message: 'FORBIDDEN_RESOURCE',
                    error: 'Forbidden',
                });
            }
            return originalMethod.apply(this, [request, response, next]);
        };
        return descriptor;
    };
};
