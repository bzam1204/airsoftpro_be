import Http from "@/infrastructure/http";
import RefreshToken from "@/application/use-cases/auth/refresh-token";
import Login from "@/application/use-cases/auth/login";
import RegisterUser from "@/application/use-cases/auth/register-user";

export default class AuthController {

  constructor(
      readonly http: Http,
      readonly login: Login,
      readonly registerUser: RegisterUser,
      readonly refreshToken: RefreshToken,
  ) {

    http.on('post', '/login', async function (params: any, body: any) {
      const {email, password} = body;
      const {accessToken, refreshToken} = await login.execute({email, password});
      return {accessToken, refreshToken};
    });

    http.on('post', '/register-user', async function (params: any, body: registerUserOutputDto) {
      return await registerUser.execute({...body, birth : new Date(body.birth)});
    });

    http.on('post', '/refresh-token', async function (params: any, body: {token: string}) {
      return await refreshToken.execute(body.token);
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
