import {CanActivate} from "@/infrastructure/can-activate";
import ExpressExecutionContext from "@/infrastructure/express-execution-context";

export default class TokenGuard implements CanActivate {

    canActivate(context: ExpressExecutionContext): Promise<boolean> | boolean {
        const fullToken = context.getRequest().headers.authorization;
        if (!fullToken) return false;
        const [, token] = fullToken.split(' ');
        return !!token;
    };

};
