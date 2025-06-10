import {inject, injectable} from "tsyringe";

import CancelGame from "@/application/use-cases/game/cancel-game";
import CreateGame from "@/application/use-cases/game/create-game";
import FinishGame from "@/application/use-cases/game/finish-game";
import StartGame from "@/application/use-cases/game/start-game";
import EditGame from "@/application/use-cases/game/edit-game";
import JoinGame from "@/application/use-cases/game/join-game";
import Login from "@/application/use-cases/auth/login";
import AddPlayerParticipation from "@/application/use-cases/game/add-player-participation";
import CancelParticipation from "@/application/use-cases/game/cancel-participation";
import ViewGameList from "@/application/use-cases/game/view-game-list";
import ViewGame from "@/application/use-cases/game/view-game";

import Http from "@/infrastructure/http";

import {
  ADD_PLAYER_PARTICIPATION,
  CANCEL_GAME,
  CANCEL_PARTICIPATION,
  CREATE_GAME,
  EDIT_GAME,
  FINISH_GAME,
  HTTP,
  JOIN_GAME,
  LOGIN,
  START_GAME,
  VIEW_GAME,
  VIEW_GAME_LIST
} from "@/shared/constants/constants";

@injectable()
export default class GameController {
  private readonly PREFIX = '/game';

  constructor(
      @inject(FINISH_GAME) readonly finishGame: FinishGame,
      @inject(CANCEL_GAME) readonly cancelGame: CancelGame,
      @inject(CREATE_GAME) readonly createGame: CreateGame,
      @inject(START_GAME) readonly startGame: StartGame,
      @inject(EDIT_GAME) readonly editGame: EditGame,
      @inject(JOIN_GAME) readonly joinGame: JoinGame,
      @inject(LOGIN) readonly login: Login,
      @inject(ADD_PLAYER_PARTICIPATION) readonly addPlayerParticipation: AddPlayerParticipation,
      @inject(CANCEL_PARTICIPATION) readonly cancelParticipation: CancelParticipation,
      @inject(VIEW_GAME_LIST) readonly viewGameList: ViewGameList,
      @inject(VIEW_GAME) readonly viewGame: ViewGame,
      @inject(HTTP) readonly http: Http,
  ) {

    http.on('post', `${this.PREFIX}/:id/finish`, async function (params: {id: string}, body: any) {
      const gameId = params.id;
      const game = await finishGame.execute(gameId);
      return {game};
    });

    http.on('post', `${this.PREFIX}/:id/start`, async function (params: {id: string}, body: any) {
      const gameId = params.id;
      const game = await startGame.execute(gameId);
      return {game};
    });

    http.on('delete', `${this.PREFIX}/:id`, async function (params: {id: string}, body: any) {
      const gameId = params.id;
      const game = await cancelGame.execute(gameId);
      return {game};
    });

    http.on('put', `${this.PREFIX}/:id`, async function (params: {id: string}, body: EditGameInputDto) {
      const id = params.id;
      const game = await editGame.execute({
        ...body,
        id,
        startDate : body.startDate ? new Date(body.startDate) : body.startDate,
      });
      return {game};
    });

    http.on('post', this.PREFIX, async function (params: any, body: CreateGameInputDto) {
      const game = createGame.execute({...body, startDate : new Date(body.startDate)});
      return {game};
    });

    http.on('post', `${this.PREFIX}/:id/join`, async function (params: {id: string}, body: JoinGameInputDto) {
      const gameId = params.id;
      const playerId = body.playerId;
      const game = await joinGame.execute(gameId, playerId);
      return {game};
    });

    http.on('post', `${this.PREFIX}/:gameId/participation`, async function (params: {gameId: string}, body: AddPlayerParticipationDto) {
      const gameId = params.gameId;
      const playerId = body.playerId;
      const game = await addPlayerParticipation.execute(gameId, playerId);
      return {game};
    });

    http.on('delete', `${this.PREFIX}/:gameId/participation/:playerId`, async function (params: {gameId: string, playerId: string}, body: any) {
      const gameId = params.gameId;
      const playerId = params.playerId;
      const game = await cancelParticipation.execute(gameId, playerId);
      return {game};
    });

    http.on('get', `${this.PREFIX}s`, async function () {
      const games = await viewGameList.execute();
      return games;
    });

    http.on('get', `${this.PREFIX}/:gameId`, async function (params: {gameId: string}) {
      const gameId = params.gameId;
      const game = await viewGame.execute(gameId);
      return {game};
    });

  };

};

interface CreateGameInputDto {
  specificRules?: string,
  minHonorLevel: number,
  playersLimit: number,
  description?: string,
  friendlyFire: boolean,
  startDate: Date,
  fpsLimit?: number,
  gameMode: string,
  fieldId: string,
}

interface EditGameInputDto {
  specificRules?: string;
  minHonorLevel?: number;
  playersLimit?: number;
  friendlyFire?: boolean;
  description?: string;
  startDate?: Date;
  fpsLimit?: number;
  gameMode?: string;
  fieldId?: string;
}

interface JoinGameInputDto {
  playerId: string;
}

interface AddPlayerParticipationDto {
  playerId: string;
}
