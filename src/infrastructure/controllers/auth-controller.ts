import {inject, injectable} from "tsyringe";

import RefreshToken from "@/application/use-cases/auth/refresh-token";
import Login from "@/application/use-cases/auth/login";

import Http from "@/infrastructure/http";

import {HTTP, LOGIN, REFRESH_TOKEN, REGISTER_USER} from "@/shared/constants/constants";

@injectable()
export default class AuthController {
  private readonly PREFIX = '/auth';

  constructor(
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
