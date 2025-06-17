import {inject, injectable} from "tsyringe";

import RefreshToken from "@/application/use-cases/auth/refresh-token";
import ValidateToken from "@/application/use-cases/auth/validate-token";
import Login from "@/application/use-cases/auth/login";

import Http from "@/infrastructure/http";

import {HTTP, LOGIN, REFRESH_TOKEN, VALIDATE_TOKEN} from "@/shared/constants/constants";

@injectable()
export default class AuthController {
  private readonly PREFIX = '/auth';

  constructor(
      @inject(REFRESH_TOKEN) readonly refreshToken: RefreshToken,
      @inject(VALIDATE_TOKEN) readonly validateToken: ValidateToken,
      @inject(LOGIN) readonly login: Login,
      @inject(HTTP) readonly http: Http,
  ) {
    /**
     * @swagger
     * /auth/login:
     *   post:
     *     summary: Authenticate user and get tokens
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/LoginInput'
     *     responses:
     *       200:
     *         description: Successfully authenticated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/LoginResponse'
     *       400:
     *         description: Invalid input data
     *       401:
     *         description: Invalid credentials
     *       404:
     *         description: User not found
     */
    http.on('post', `${this.PREFIX}/login`, async function (params: any, body: any) {
      const {email, password} = body;
      const {accessToken, refreshToken} = await login.execute({email, password});
      return {accessToken, refreshToken};
    });

    /**
     * @swagger
     * /auth/refresh-token:
     *   post:
     *     summary: Get new access token using refresh token
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/RefreshTokenInput'
     *     responses:
     *       200:
     *         description: Successfully refreshed tokens
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/RefreshTokenResponse'
     *       400:
     *         description: Invalid input data
     *       401:
     *         description: Invalid or expired refresh token
     */
    http.on('post', `${this.PREFIX}/refresh-token`, async function (params: any, body: {token: string}) {
      return await refreshToken.execute(body.token);
    });

    http.on('post', `${this.PREFIX}/validate-token`, async function (params: any, body: {token: string}) {
      const valid = await validateToken.execute(body.token);
      return {valid};
    });

  };

};
