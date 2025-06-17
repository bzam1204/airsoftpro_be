import {inject, injectable} from "tsyringe";
import RefreshToken from "@/application/use-cases/auth/refresh-token";
import Login from "@/application/use-cases/auth/login";
import Http from "@/infrastructure/http";
import {HTTP, LOGIN, REFRESH_TOKEN} from "@/shared/constants/constants";

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *     LoginResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: JWT access token
 *         refreshToken:
 *           type: string
 *           description: JWT refresh token for obtaining new access tokens
 *     RefreshTokenInput:
 *       type: object
 *       required:
 *         - token
 *       properties:
 *         token:
 *           type: string
 *           description: Refresh token obtained from login
 *     RefreshTokenResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: New JWT access token
 *         refreshToken:
 *           type: string
 *           description: New JWT refresh token
 */

@injectable()
export default class AuthController {
  private readonly PREFIX = '/auth';

  constructor(
    @inject(REFRESH_TOKEN) readonly refreshToken: RefreshToken,
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
  }
}