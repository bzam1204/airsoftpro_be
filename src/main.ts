import Login from "@/application/use-cases/login";
import FieldAdminRepositoryMemory from "@/infrastructure/repositories/field-admin-repository-memory";
import PlayerRepositoryMemory from "@/infrastructure/repositories/player-repository-memory";
import UserRepositoryMemory from "@/infrastructure/repositories/user-repository-memory";
import HashingServiceBcryptjs from "@/infrastructure/services/hashing-service-bcryptjs";
import {Payload} from "@/application/use-cases/refresh-token";
import AuthController from "@/infrastructure/controllers/auth-controller";
import ExpressAdapter from "@/infrastructure/express-adapter";
import RegisterUser from "@/application/use-cases/register-user";
import VerifyPlayerName from "@/application/use-cases/verify-player-name";
import CreatePlayer from "@/application/use-cases/create-player";
import UUIDGenerator from "@/infrastructure/services/id-generator";
import CreateUser from "@/application/use-cases/create-user";

const app = new ExpressAdapter();
const fieldAdminRepository = new FieldAdminRepositoryMemory();
const playerRepository = new PlayerRepositoryMemory();
const hashingService = new HashingServiceBcryptjs();
const userRepository = new UserRepositoryMemory();
const tokenProviderStub = {
  signRefreshToken : () => '321321',
  signAccessToken : () => '123123',
  validate : () => true,
  decode : () => ({} as Payload),
};
const idGenerator = new UUIDGenerator();
const verifyPlayerName = new VerifyPlayerName(playerRepository);
const createPlayer = new CreatePlayer(playerRepository, userRepository, idGenerator);
const createUser = new CreateUser(userRepository, hashingService, idGenerator);
const login = new Login(fieldAdminRepository, playerRepository, userRepository, hashingService, tokenProviderStub);
const registerUser = new RegisterUser(verifyPlayerName, tokenProviderStub, createPlayer, createUser);
new AuthController(app, login, registerUser);
app.listen(3000);
