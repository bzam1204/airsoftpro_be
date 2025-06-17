import {inject, injectable} from "tsyringe";
import CreateFieldAdmin from "@/application/use-cases/field/create-field-admin";
import Login from "@/application/use-cases/auth/login";
import RegisterUser from "@/application/use-cases/auth/register-user";
import Http from "@/infrastructure/http";
import {CREATE_FIELD_ADMIN, HTTP, LOGIN, REGISTER_USER} from "@/shared/constants/constants";

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterUserInput:
 *       type: object
 *       required:
 *         - playerName
 *         - password
 *         - fullName
 *         - birth
 *         - email
 *       properties:
 *         playerName:
 *           type: string
 *           description: Player's username
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *         fullName:
 *           type: string
 *           description: User's full name
 *         birth:
 *           type: string
 *           format: date
 *           description: User's birthdate
 *         photo:
 *           type: string
 *           description: URL or base64 of user's photo
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *     FieldAdminInput:
 *       type: object
 *       required:
 *         - userId
 *       properties:
 *         userId:
 *           type: string
 *           description: ID of the user to be made field admin
 */

@injectable()
export default class AccountController {
  private readonly PREFIX = '/account';

  constructor(
    @inject(CREATE_FIELD_ADMIN) readonly createFieldAdmin: CreateFieldAdmin,
    @inject(REGISTER_USER) readonly registerUser: RegisterUser,
    @inject(LOGIN) readonly login: Login,
    @inject(HTTP) readonly http: Http,
  ) {
    /**
     * @swagger
     * /account:
     *   post:
     *     summary: Register a new user
     *     tags: [Account]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/RegisterUserInput'
     *     responses:
     *       200:
     *         description: User successfully registered
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                 playerName:
     *                   type: string
     *                 fullName:
     *                   type: string
     *                 email:
     *                   type: string
     *       400:
     *         description: Invalid input data
     *       409:
     *         description: User already exists
     */
    http.on('post', this.PREFIX, async function (params: any, body: registerUserInputDto) {
      return await registerUser.execute({...body, birth: new Date(body.birth)});
    });

    /**
     * @swagger
     * /account/field-admin:
     *   post:
     *     summary: Create a field admin
     *     tags: [Account]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/FieldAdminInput'
     *     responses:
     *       200:
     *         description: Field admin successfully created
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                 userId:
     *                   type: string
     *                 role:
     *                   type: string
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: User not found
     *       409:
     *         description: User is already a field admin
     */
    http.on('post', `${this.PREFIX}/field-admin`, async function (params: any, body: {userId: string}) {
      return await createFieldAdmin.execute({userId: body.userId});
    });
  }
}

interface registerUserInputDto {
  playerName: string;
  password: string;
  fullName: string;
  birth: Date;
  photo: string;
  email: string;
}
