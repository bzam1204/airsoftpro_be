import {sign, SignOptions, verify, decode} from 'jsonwebtoken';
import {injectable} from 'tsyringe';

import TokenProvider from '@/application/services/token-provider';
import {Payload} from '@/application/use-cases/auth/refresh-token';

@injectable()
export default class JwtService implements TokenProvider {
    private readonly refreshTokenExpiresIn;
    private readonly accessTokenExpiresIn;
    private readonly refreshTokenSecret;
    private readonly accessTokenSecret;

    constructor() {
        this.refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN ?? '7d';
        this.accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN ?? '1d';
        this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET ?? 'secret';
        this.accessTokenSecret = process.env.ACCESS_TOKEN_SECRET ?? 'secret';
    };

    signRefreshToken(payload: Payload): string {
        const signOptions: SignOptions = {expiresIn: this.refreshTokenExpiresIn} as SignOptions;
        return sign(payload, this.refreshTokenSecret, signOptions);
    };

    signAccessToken(payload: Payload): string {
        const signOptions: SignOptions = {expiresIn: this.accessTokenExpiresIn} as SignOptions;
        return sign(payload, this.accessTokenSecret, signOptions);
    };

    verifyAccessToken(token: string): boolean {
        return !!verify(token, this.accessTokenSecret);
    };

    verifyRefreshToken(token: string): boolean {
        return !!verify(token, this.refreshTokenSecret);
    };

    decode(token: string): Payload {
        const decoded = decode(token);
        return decoded as Payload;
    };

};
