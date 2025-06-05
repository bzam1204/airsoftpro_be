import {inject, injectable} from "tsyringe";

import CreateFieldAdmin from "@/application/use-cases/field/create-field-admin";
import Login from "@/application/use-cases/auth/login";

import RegisterUser from "@/application/use-cases/auth/register-user";
import Http from "@/infrastructure/http";

import {CREATE_FIELD_ADMIN, HTTP, LOGIN, REGISTER_USER} from "@/shared/constants/constants";

@injectable()
export default class AccountController {
  private readonly PREFIX = '/account';

  constructor(
      @inject(CREATE_FIELD_ADMIN) readonly createFieldAdmin: CreateFieldAdmin,
      @inject(REGISTER_USER) readonly registerUser: RegisterUser,
      @inject(LOGIN) readonly login: Login,
      @inject(HTTP) readonly http: Http,
  ) {

    http.on('post', this.PREFIX, async function (params: any, body: registerUserInputDto) {
      return await registerUser.execute({...body, birth : new Date(body.birth)});
    });

    //TODO: implement the jwt guard to protect this route and hydrate the user info
    http.on('post', `${this.PREFIX}/field-admin`, async function (params: any, body: {userId: string}) {
      return await createFieldAdmin.execute({userId : body.userId});
    });

  };

};

interface registerUserInputDto {
  playerName: string;
  password: string;
  fullName: string;
  birth: Date;
  photo: string;
  email: string;
}
