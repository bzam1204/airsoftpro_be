import {inject, injectable} from 'tsyringe';

import CreateFieldAdmin from '@/application/use-cases/field/create-field-admin';
import RegisterUser from '@/application/use-cases/auth/register-user';

import Controller from '@/infrastructure/decorators/controller.decorator';
import Post from '@/infrastructure/decorators/post';

import {CREATE_FIELD_ADMIN, REGISTER_USER} from '@/shared/constants/constants';
import {Body, Params} from '@/infrastructure/decorators/parameter.decorator';

@injectable()
@Controller('/account')
export default class AccountController {
    constructor(
        @inject(CREATE_FIELD_ADMIN) private readonly _createFieldAdmin: CreateFieldAdmin,
        @inject(REGISTER_USER) private readonly _registerUser: RegisterUser,
    ) {
    };

    @Post('/field-admin')
    async createFieldAdmin(@Body() input: {userId: string}) {
        return await this._createFieldAdmin.execute({userId: input.userId});
    };

    @Post()
    async registerUser(@Body('birth') input: registerUserInputDto, @Params() params: any) {
        return await this._registerUser.execute({...input, birth: new Date(input.birth)});
    };

}

interface registerUserInputDto {
    playerName: string;
    password: string;
    fullName: string;
    birth: Date;
    photo: string;
    email: string;
}
