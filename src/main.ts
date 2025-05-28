import RefreshToken, {Payload} from "@/application/use-cases/auth/refresh-token";

import FieldAdminRepositoryMemory from "@/infrastructure/repositories/field-admin-repository-memory";
import PlayerRepositoryMemory from "@/infrastructure/repositories/player-repository-memory";
import HashingServiceBcryptjs from "@/infrastructure/services/hashing-service-bcryptjs";
import UserRepositoryMemory from "@/infrastructure/repositories/user-repository-memory";
import AuthController from "@/infrastructure/controllers/auth-controller";
import ExpressAdapter from "@/infrastructure/express-adapter";
import UUIDGenerator from "@/infrastructure/services/id-generator";
import TokenProviderObject from "@/infrastructure/services/token-provider-object";

import ValidateToken from "@/application/use-cases/auth/validate-token";
import Login from "@/application/use-cases/auth/login";
import RegisterUser from "@/application/use-cases/auth/register-user";
import CreatePlayer from "@/application/use-cases/player/create-player";
import VerifyPlayerName from "@/application/use-cases/player/verify-player-name";
import CreateUser from "@/application/use-cases/auth/create-user";

const app = new ExpressAdapter();
const fieldAdminRepository = new FieldAdminRepositoryMemory();
const playerRepository = new PlayerRepositoryMemory();
const hashingService = new HashingServiceBcryptjs();
const userRepository = new UserRepositoryMemory();
const tokenProvider = new TokenProviderObject();
const idGenerator = new UUIDGenerator();
const verifyPlayerName = new VerifyPlayerName(playerRepository);
const createPlayer = new CreatePlayer(playerRepository, userRepository, idGenerator);
const createUser = new CreateUser(userRepository, hashingService, idGenerator);
const login = new Login(fieldAdminRepository, playerRepository, userRepository, hashingService, tokenProvider);
const registerUser = new RegisterUser(verifyPlayerName, tokenProvider, createPlayer, createUser);
const validateToken = new ValidateToken(tokenProvider);
const refreshToken = new RefreshToken(fieldAdminRepository, playerRepository, tokenProvider, validateToken)
new AuthController(app, login, registerUser, refreshToken);
app.listen(3000);
