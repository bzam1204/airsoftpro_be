import {inject, injectable} from 'tsyringe';

import RefreshToken from '@/application/use-cases/auth/refresh-token';
import ValidateToken from '@/application/use-cases/auth/validate-token';
import Login from '@/application/use-cases/auth/login';

import Http from '@/infrastructure/http';

import {LoginInputDto} from '@/infrastructure/dtos/login.dto';
import Controller from '@/infrastructure/decorators/controller.decorator';
import {Body} from '@/infrastructure/decorators/parameter.decorator';
import {Post} from '@/infrastructure/decorators/routes.decorator';

import {HTTP, LOGIN, REFRESH_TOKEN, VALIDATE_TOKEN} from '@/shared/constants/constants';

@injectable()
@Controller('/auth')
export default class AuthController {
    private readonly PREFIX = '/auth';

    constructor(
        @inject(VALIDATE_TOKEN) readonly _validateToken: ValidateToken,
        @inject(REFRESH_TOKEN) readonly _refreshToken: RefreshToken,
        @inject(LOGIN) readonly _login: Login,
        @inject(HTTP) readonly http: Http,
    ) {

        http.on('post', `${this.PREFIX}/refresh-token`, async function (params: any, body: {token: string}) {
            return await _refreshToken.execute(body.token);
        });

        http.on('post', `${this.PREFIX}/validate-token`, async function (params: any, body: {token: string}) {
            const valid = await _validateToken.execute(body.token);
            return {valid};
        });

    }

    @Post('/login')
    async login(@Body() input: LoginInputDto) {
        const {accessToken, refreshToken} = await this._login.execute(input);
        return {accessToken, refreshToken};
    };

};
