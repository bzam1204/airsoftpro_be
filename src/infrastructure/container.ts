import {container} from 'tsyringe';

import * as Constants from "@/shared/constants/constants";

import ViewReceivedReportsHistory from "@/application/use-cases/report/view-received-reports-history";
import ViewGivenReportsHistory from "@/application/use-cases/report/view-given-reports-history";
import AddPlayerParticipation from "@/application/use-cases/game/add-player-participation";
import CancelParticipation from "@/application/use-cases/game/cancel-participation";
import VerifyPlayerName from "@/application/use-cases/player/verify-player-name";
import CreateFieldAdmin from "@/application/use-cases/field/create-field-admin";
import ValidateToken from "@/application/use-cases/auth/validate-token";
import ViewFieldList from "@/application/use-cases/field/view-field-list";
import RegisterField from "@/application/use-cases/field/register-field";
import RefreshToken from "@/application/use-cases/auth/refresh-token";
import RegisterUser from "@/application/use-cases/auth/register-user";
import CreatePlayer from "@/application/use-cases/player/create-player";
import CreateReport from "@/application/use-cases/report/create-report";
import ViewGameList from "@/application/use-cases/game/view-game-list";
import CreateUser from "@/application/use-cases/auth/create-user";
import CancelGame from "@/application/use-cases/game/cancel-game";
import FinishGame from "@/application/use-cases/game/finish-game";
import CreateGame from "@/application/use-cases/game/create-game";
import ViewField from "@/application/use-cases/field/view-field";
import EditField from "@/application/use-cases/field/edit-field";
import StartGame from "@/application/use-cases/game/start-game";
import EditGame from "@/application/use-cases/game/edit-game";
import ViewGame from "@/application/use-cases/game/view-game";
import JoinGame from "@/application/use-cases/game/join-game";
import Login from "@/application/use-cases/auth/login";

import FieldAdminRepositoryMemory from "@/infrastructure/repositories/field-admin-repository-memory";
import ReportRepositoryMemory from "@/infrastructure/repositories/report-repository-memory";
import PlayerRepositoryMemory from "@/infrastructure/repositories/player-repository-memory";
import HashingServiceBcryptjs from "@/infrastructure/services/hashing-service-bcryptjs";
import FieldRepositoryMemory from "@/infrastructure/repositories/field-repository-memory";
import AdminRepositoryMemory from "@/infrastructure/repositories/admin-repository-memory";
import GameRepositoryMemory from "@/infrastructure/repositories/game-repository-memory";
import UserRepositoryMemory from "@/infrastructure/repositories/user-repository-memory";
import TokenProviderObject from "@/infrastructure/services/token-provider-object";
import UUIDGenerator from "@/infrastructure/services/id-generator";

container.register(Constants.FIELD_ADMIN_REPOSITORY, {useValue : new FieldAdminRepositoryMemory()});
container.register(Constants.REPORT_REPOSITORY, {useValue : new ReportRepositoryMemory()});
container.register(Constants.PLAYER_REPOSITORY, {useValue : new PlayerRepositoryMemory()});
container.register(Constants.ADMIN_REPOSITORY, {useValue : new AdminRepositoryMemory()})
container.register(Constants.FIELD_REPOSITORY, {useValue : new FieldRepositoryMemory()});
container.register(Constants.GAME_REPOSITORY, {useValue : new GameRepositoryMemory()});
container.register(Constants.USER_REPOSITORY, {useValue : new UserRepositoryMemory()});

container.register(Constants.HASHING_SERVICE, {useClass : HashingServiceBcryptjs});
container.register(Constants.TOKEN_PROVIDER, {useClass : TokenProviderObject});
container.register(Constants.ID_GENERATOR, {useClass : UUIDGenerator});

container.register(Constants.VIEW_RECEIVED_REPORTS_HISTORY, {useClass : ViewReceivedReportsHistory});
container.register(Constants.VIEW_GIVEN_REPORTS_HISTORY, {useClass : ViewGivenReportsHistory});
container.register(Constants.ADD_PLAYER_PARTICIPATION, {useClass : AddPlayerParticipation});
container.register(Constants.CANCEL_PARTICIPATION, {useClass : CancelParticipation});
container.register(Constants.CREATE_FIELD_ADMIN, {useClass : CreateFieldAdmin});
container.register(Constants.VERIFY_PLAYER_NAME, {useClass : VerifyPlayerName});
container.register(Constants.REGISTER_FIELD, {useClass : RegisterField});
container.register(Constants.VIEW_FIELD_LIST, {useClass : ViewFieldList});
container.register(Constants.VALIDATE_TOKEN, {useClass : ValidateToken});
container.register(Constants.REGISTER_USER, {useClass : RegisterUser});
container.register(Constants.CREATE_PLAYER, {useClass : CreatePlayer});
container.register(Constants.REFRESH_TOKEN, {useClass : RefreshToken});
container.register(Constants.VIEW_GAME_LIST, {useClass : ViewGameList});
container.register(Constants.CREATE_REPORT, {useClass : CreateReport});
container.register(Constants.CREATE_USER, {useClass : CreateUser});
container.register(Constants.CANCEL_GAME, {useClass : CancelGame});
container.register(Constants.FINISH_GAME, {useClass : FinishGame});
container.register(Constants.CREATE_GAME, {useClass : CreateGame});
container.register(Constants.VIEW_FIELD, {useClass : ViewField});
container.register(Constants.EDIT_FIELD, {useClass : EditField});
container.register(Constants.START_GAME, {useClass : StartGame});
container.register(Constants.VIEW_GAME, {useClass : ViewGame});
container.register(Constants.JOIN_GAME, {useClass : JoinGame});
container.register(Constants.EDIT_GAME, {useClass : EditGame});
container.register(Constants.LOGIN, {useClass : Login});

export default container;
