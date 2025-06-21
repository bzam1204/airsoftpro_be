import {inject, injectable} from 'tsyringe';

import RefreshToken from '@/application/use-cases/auth/refresh-token';
import ValidateToken from '@/application/use-cases/auth/validate-token';
import Login from '@/application/use-cases/auth/login';

import Http from '@/infrastructure/http';

import {HTTP, LOGIN, REFRESH_TOKEN, VALIDATE_TOKEN} from '@/shared/constants/constants';

@injectable()
export default class AuthController {
    private readonly PREFIX = '/auth';

    constructor(
        @inject(VALIDATE_TOKEN) readonly validateToken: ValidateToken,
        @inject(REFRESH_TOKEN) readonly refreshToken: RefreshToken,
        @inject(LOGIN) readonly login: Login,
        @inject(HTTP) readonly http: Http,
    ) {

        http.on('post', `${this.PREFIX}/login`, async function (params: any, body: any) {
            const {email, password} = body;
            const {accessToken, refreshToken} = await login.execute({email, password});
            return {accessToken, refreshToken};
        });

        http.on('post', `${this.PREFIX}/refresh-token`, async function (params: any, body: {token: string}) {
            return await refreshToken.execute(body.token);
        });

        http.on('post', `${this.PREFIX}/validate-token`, async function (params: any, body: {token: string}) {
            const valid = await validateToken.execute(body.token);
            return {valid};
        });

    };

};
