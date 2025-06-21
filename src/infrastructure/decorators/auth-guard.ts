import {NextFunction, Request, Response} from 'express';
import {container} from 'tsyringe';

import TokenProvider from '@/application/services/token-provider';

import {TOKEN_PROVIDER} from '@/shared/constants/constants';

export default function AuthGuard() {
    return function ( target: any, propertyKey: string, descriptor: PropertyDescriptor ) {
        const originalMethod = descriptor.value;
        descriptor.value = async function ( req: Request, res: Response, next: NextFunction ) {
            try {
                const authHeader = req.headers.authorization;
                if (!authHeader) return res.status(401).json({message: 'NO_TOKEN_PROVIDED'});
                const [, token] = authHeader.split(' ');
                if (!token) return res.status(401).json({message: 'INVALID_TOKEN'});
                const tokenProvider = container.resolve<TokenProvider>(TOKEN_PROVIDER);
                const isValid = tokenProvider.verifyAccessToken(token);
                if (!isValid) return res.status(401).json({message: 'INVALID_TOKEN'});
                (req as any).user = tokenProvider.decode(token);
                return originalMethod.apply(this, [req, res, next]);
            } catch (error) {
                return res.status(401).json({message: 'UNAUTHORIZED'});
            }
        };
    };
};
