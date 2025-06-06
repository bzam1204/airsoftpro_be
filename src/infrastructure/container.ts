import {container} from 'tsyringe';

import * as Constants from "@/shared/constants/constants";

import AddPlayerParticipation from "@/application/use-cases/game/add-player-participation";
import CancelParticipation from "@/application/use-cases/game/cancel-participation";
import VerifyPlayerName from "@/application/use-cases/player/verify-player-name";
import CreateFieldAdmin from "@/application/use-cases/field/create-field-admin";
import ValidateToken from "@/application/use-cases/auth/validate-token";
import RefreshToken from "@/application/use-cases/auth/refresh-token";
import RegisterUser from "@/application/use-cases/auth/register-user";
import CreatePlayer from "@/application/use-cases/player/create-player";
import CreateReport from "@/application/use-cases/report/create-report";
import CreateUser from "@/application/use-cases/auth/create-user";
import CancelGame from "@/application/use-cases/game/cancel-game";
import CreateGame from "@/application/use-cases/game/create-game";
import EditField from "@/application/use-cases/field/edit-field";
import EditGame from "@/application/use-cases/game/edit-game";
import Login from "@/application/use-cases/auth/login";

import FieldAdminRepositoryMemory from "@/infrastructure/repositories/field-admin-repository-memory";
import ReportRepositoryMemory from "@/infrastructure/repositories/report-repository-memory";
import PlayerRepositoryMemory from "@/infrastructure/repositories/player-repository-memory";
import HashingServiceBcryptjs from "@/infrastructure/services/hashing-service-bcryptjs";
import FieldRepositoryMemory from "@/infrastructure/repositories/field-repository-memory";
import GameRepositoryMemory from "@/infrastructure/repositories/game-repository-memory";
import UserRepositoryMemory from "@/infrastructure/repositories/user-repository-memory";
import TokenProviderObject from "@/infrastructure/services/token-provider-object";
import UUIDGenerator from "@/infrastructure/services/id-generator";
import FinishGame from "@/application/use-cases/game/finish-game";
import JoinGame from "@/application/use-cases/game/join-game";

container.register(Constants.FIELD_ADMIN_REPOSITORY, {useValue : new FieldAdminRepositoryMemory()});
container.register(Constants.REPORT_REPOSITORY, {useValue : new ReportRepositoryMemory()});
container.register(Constants.PLAYER_REPOSITORY, {useValue : new PlayerRepositoryMemory()});
container.register(Constants.FIELD_REPOSITORY, {useValue : new FieldRepositoryMemory()});
container.register(Constants.GAME_REPOSITORY, {useValue : new GameRepositoryMemory()});
container.register(Constants.USER_REPOSITORY, {useValue : new UserRepositoryMemory()})

container.register(Constants.HASHING_SERVICE, {useClass : HashingServiceBcryptjs});
container.register(Constants.TOKEN_PROVIDER, {useClass : TokenProviderObject});
container.register(Constants.ID_GENERATOR, {useClass : UUIDGenerator});

container.register(Constants.ADD_PLAYER_PARTICIPATION, {useClass : AddPlayerParticipation});
container.register(Constants.CANCEL_PARTICIPATION, {useClass : CancelParticipation});
container.register(Constants.CREATE_FIELD_ADMIN, {useClass : CreateFieldAdmin});
container.register(Constants.VERIFY_PLAYER_NAME, {useClass : VerifyPlayerName});
container.register(Constants.VALIDATE_TOKEN, {useClass : ValidateToken});
container.register(Constants.REGISTER_USER, {useClass : RegisterUser});
container.register(Constants.CREATE_PLAYER, {useClass : CreatePlayer});
container.register(Constants.REFRESH_TOKEN, {useClass : RefreshToken});
container.register(Constants.CREATE_REPORT, {useClass : CreateReport});
container.register(Constants.CREATE_USER, {useClass : CreateUser});
container.register(Constants.CANCEL_GAME, {useClass : CancelGame});
container.register(Constants.FINISH_GAME, {useClass : FinishGame});
container.register(Constants.JOIN_GAME, {useClass : JoinGame});
container.register(Constants.CREATE_GAME, {useClass : CreateGame});
container.register(Constants.EDIT_FIELD, {useClass : EditField});
container.register(Constants.EDIT_GAME, {useClass : EditGame});
container.register(Constants.LOGIN, {useClass : Login});

export default container;
