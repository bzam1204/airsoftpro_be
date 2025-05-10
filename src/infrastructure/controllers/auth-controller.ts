import RegisterUser from "@/application/use-cases/register-user";
import Login from "@/application/use-cases/login";

import Http from "@/infrastructure/http";

export default class AuthController {

  constructor(
      readonly http: Http,
      readonly login: Login,
      readonly registerUser: RegisterUser,
  ) {

    http.on('post', '/login', async function (params: any, body: any) {
      const {email, password} = body;
      const {accessToken, refreshToken} = await login.execute({email, password});
      return {accessToken, refreshToken};
    });

    http.on('post', '/register-user', async function (params: any, body: registerUserOutputDto) {
      return await registerUser.execute({...body, birth : new Date(body.birth)});
    });
  };

};

interface registerUserOutputDto {
  playerName: string;
  password: string;
  fullName: string;
  birth: Date;
  photo: string;
  email: string;
}
