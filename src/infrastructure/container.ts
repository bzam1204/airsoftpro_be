import {container} from 'tsyringe';

import {
  FIELD_ADMIN_REPOSITORY,
  VERIFY_PLAYER_NAME,
  PLAYER_REPOSITORY,
  HASHING_SERVICE,
  USER_REPOSITORY,
  REGISTER_USER,
  TOKEN_PROVIDER,
  ID_GENERATOR,
  LOGIN,
  CREATE_PLAYER,
  CREATE_USER,
  REFRESH_TOKEN,
  VALIDATE_TOKEN,
  ADD_PLAYER_PARTICIPATION,
  GAME_REPOSITORY,
  REMOVE_PLAYER_PARTICIPATION, CANCEL_GAME, CREATE_FIELD_ADMIN,
} from "@/shared/constants/constants";

import CancelParticipation from "@/application/use-cases/game/cancel-participation";
import AddPlayerParticipation from "@/application/use-cases/game/add-player-participation";
import VerifyPlayerName from "@/application/use-cases/player/verify-player-name";
import CreateFieldAdmin from "@/application/use-cases/field/create-field-admin";
import ValidateToken from "@/application/use-cases/auth/validate-token";
import RefreshToken from "@/application/use-cases/auth/refresh-token";
import RegisterUser from "@/application/use-cases/auth/register-user";
import CreatePlayer from "@/application/use-cases/player/create-player";
import CreateUser from "@/application/use-cases/auth/create-user";
import CancelGame from "@/application/use-cases/game/cancel-game";
import Login from "@/application/use-cases/auth/login";

import FieldAdminRepositoryMemory from "@/infrastructure/repositories/field-admin-repository-memory";
import PlayerRepositoryMemory from "@/infrastructure/repositories/player-repository-memory";
import HashingServiceBcryptjs from "@/infrastructure/services/hashing-service-bcryptjs";
import GameRepositoryMemory from "@/infrastructure/repositories/game-repository-memory";
import UserRepositoryMemory from "@/infrastructure/repositories/user-repository-memory";
import TokenProviderObject from "@/infrastructure/services/token-provider-object";
import UUIDGenerator from "@/infrastructure/services/id-generator";

container.register(FIELD_ADMIN_REPOSITORY, {useValue : new FieldAdminRepositoryMemory()});
container.register(PLAYER_REPOSITORY, {useValue : new PlayerRepositoryMemory()});
container.register(GAME_REPOSITORY, {useValue : new GameRepositoryMemory()});
container.register(USER_REPOSITORY, {useValue : new UserRepositoryMemory()})

container.register(HASHING_SERVICE, {useClass : HashingServiceBcryptjs});
container.register(TOKEN_PROVIDER, {useClass : TokenProviderObject});
container.register(ID_GENERATOR, {useClass : UUIDGenerator});

container.register(REMOVE_PLAYER_PARTICIPATION, {useClass : CancelParticipation});
container.register(CREATE_FIELD_ADMIN, {useClass : CreateFieldAdmin});
container.register(ADD_PLAYER_PARTICIPATION, {useClass : AddPlayerParticipation});
container.register(VERIFY_PLAYER_NAME, {useClass : VerifyPlayerName});
container.register(VALIDATE_TOKEN, {useClass : ValidateToken});
container.register(REGISTER_USER, {useClass   : RegisterUser});
container.register(CREATE_PLAYER, {useClass : CreatePlayer});
container.register(REFRESH_TOKEN, {useClass : RefreshToken});
container.register(CREATE_USER, {useClass : CreateUser});
container.register(CANCEL_GAME, {useClass : CancelGame});
container.register(LOGIN, {useClass : Login});

export default container;
