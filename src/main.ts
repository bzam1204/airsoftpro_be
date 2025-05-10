import RefreshToken, {Payload} from "@/application/use-cases/refresh-token";
import VerifyPlayerName from "@/application/use-cases/verify-player-name";
import RegisterUser from "@/application/use-cases/register-user";
import CreatePlayer from "@/application/use-cases/create-player";
import CreateUser from "@/application/use-cases/create-user";
import Login from "@/application/use-cases/login";


import FieldAdminRepositoryMemory from "@/infrastructure/repositories/field-admin-repository-memory";
import PlayerRepositoryMemory from "@/infrastructure/repositories/player-repository-memory";
import HashingServiceBcryptjs from "@/infrastructure/services/hashing-service-bcryptjs";
import UserRepositoryMemory from "@/infrastructure/repositories/user-repository-memory";
import AuthController from "@/infrastructure/controllers/auth-controller";
import ExpressAdapter from "@/infrastructure/express-adapter";
import UUIDGenerator from "@/infrastructure/services/id-generator";
import TokenProviderObject from "@/infrastructure/services/token-provider-object";

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
const refreshToken = new RefreshToken(fieldAdminRepository, playerRepository, tokenProvider)
new AuthController(app, login, registerUser, refreshToken);
app.listen(3000);
