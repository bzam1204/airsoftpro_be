import {Request, Response, NextFunction} from 'express';
import {AuthException, DomainException} from '@/application/error-patterns';
import {ErrorResponse} from '@/infrastructure/api-response';

export default function globalErrorHandler(error: Error, request: Request, response: Response, next: NextFunction) {
    if (error instanceof DomainException) return response.status(400).json(new ErrorResponse(error.code));
    if (error instanceof AuthException) return response.status(403).json(new ErrorResponse(error.code));
    return response.status(500).json(new ErrorResponse('INTERNAL_SERVER_ERROR'));
};
