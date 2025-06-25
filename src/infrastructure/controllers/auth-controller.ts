import {inject, injectable} from 'tsyringe';

import RefreshToken from '@/application/use-cases/auth/refresh-token';
import ValidateToken from '@/application/use-cases/auth/validate-token';
import Login from '@/application/use-cases/auth/login';

import {LoginInputDto} from '@/infrastructure/dtos/login.dto';
import Controller from '@/infrastructure/decorators/controller.decorator';
import {Body} from '@/infrastructure/decorators/parameter.decorator';
import {Post} from '@/infrastructure/decorators/routes.decorator';

import {LOGIN, REFRESH_TOKEN, VALIDATE_TOKEN} from '@/shared/constants/constants';

@injectable()
@Controller('/auth')
export default class AuthController {

    constructor(
        @inject(VALIDATE_TOKEN) readonly _validateToken: ValidateToken,
        @inject(REFRESH_TOKEN) readonly _refreshToken: RefreshToken,
        @inject(LOGIN) readonly _login: Login,
    ) {
    };

    @Post('/refresh-token')
    async refreshToken(@Body() input: {token: string}) {
        const {accessToken, refreshToken} = await this._refreshToken.execute(input.token);
        return {accessToken, refreshToken};
    };

    @Post('/validate-token')
    async validateToken(@Body() input: {token: string}) {
        const valid = await this._validateToken.execute(input.token);
        return {valid};
    };

    @Post('/login')
    async login(@Body() input: LoginInputDto) {
        const {accessToken, refreshToken} = await this._login.execute(input);
        return {accessToken, refreshToken};
    };

};
