import {inject, injectable} from "tsyringe";

import RefreshToken from "@/application/use-cases/auth/refresh-token";
import ValidateToken from "@/application/use-cases/auth/validate-token";
import Login from "@/application/use-cases/auth/login";
import CreateUser from "@/application/use-cases/auth/create-user";
import RegisterUser from "@/application/use-cases/auth/register-user";

import Http from "@/infrastructure/http";

import {
  HTTP,
  LOGIN,
  REFRESH_TOKEN,
  VALIDATE_TOKEN,
  CREATE_USER,
  REGISTER_USER
} from "@/shared/constants/constants";

@injectable()
export default class AuthController {
  private readonly authPrefix = '/auth';
  private readonly usersPrefix = '/users';

  constructor(
      @inject(REFRESH_TOKEN) readonly refreshTokenUseCase: RefreshToken,
      @inject(VALIDATE_TOKEN) readonly validateTokenUseCase: ValidateToken,
      @inject(LOGIN) readonly loginUseCase: Login,
      @inject(CREATE_USER) readonly createUserUseCase: CreateUser,
      @inject(REGISTER_USER) readonly registerUserUseCase: RegisterUser,
      @inject(HTTP) readonly http: Http,
  ) {

    http.on('post', this.usersPrefix, async function (params: any, body: CreateUserDto) {
      const { password, ...user } = await createUserUseCase.execute({
        ...body,
        birth: new Date(body.birth),
      });
      return { user };
    });

    http.on('post', `${this.authPrefix}/register`, async function (params: any, body: RegisterNewUserDto) {
      const result = await registerUserUseCase.execute({
        ...body,
        birth: new Date(body.birth),
      });
      // Assuming result is { user, player, accessToken, refreshToken }
      // And user within result might contain password.
      if (result.user && 'password' in result.user) {
        const { password, ...userWithoutPassword } = result.user as any; // Use 'as any' for temp access
        return { ...result, user: userWithoutPassword };
      }
      return result;
    });

    http.on('post', `${this.authPrefix}/login`, async function (params: any, body: LoginDto) {
      const {email, password} = body;
      const {accessToken, refreshToken} = await loginUseCase.execute({email, password});
      return {accessToken, refreshToken};
    });

    http.on('post', `${this.authPrefix}/refresh-token`, async function (params: any, body: RefreshTokenDto) {
      // Assuming refreshTokenUseCase returns {accessToken, refreshToken}
      return await refreshTokenUseCase.execute(body.refreshToken);
    });

    http.on('post', `${this.authPrefix}/validate-token`, async function (params: any, body: ValidateTokenDto) {
      const isValid = await validateTokenUseCase.execute(body.token);
      return {isValid};
    });

  };

};

// DTOs
interface CreateUserDto {
  name: string;
  photo: string;
  email: string;
  password: string;
  fullName: string;
  birth: string; // Will be converted to Date
}

interface RegisterNewUserDto {
  playerName: string;
  password: string;
  fullName: string;
  birth: string; // Will be converted to Date
  photo: string;
  email: string;
}

interface LoginDto {
  email: string;
  password: string;
}

interface RefreshTokenDto {
  refreshToken: string;
}

interface ValidateTokenDto {
  token: string;
}
