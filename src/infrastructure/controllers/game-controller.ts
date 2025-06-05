import {inject, injectable} from "tsyringe";

import CancelGame from "@/application/use-cases/game/cancel-game";
import CreateGame from "@/application/use-cases/game/create-game";
import Login from "@/application/use-cases/auth/login";

import Http from "@/infrastructure/http";

import {CANCEL_GAME, CREATE_GAME, HTTP, LOGIN} from "@/shared/constants/constants";

@injectable()
export default class GameController {
  private readonly PREFIX = '/game';

  constructor(
      @inject(CANCEL_GAME) readonly cancelGame: CancelGame,
      @inject(CREATE_GAME) readonly createGame: CreateGame,
      @inject(LOGIN) readonly login: Login,
      @inject(HTTP) readonly http: Http,
  ) {

    http.on('delete', `${this.PREFIX}/:id`, async function (params: {id: string}, body: any) {
      const gameId = params.id;
      const game = await cancelGame.execute(gameId);
      return {game};
    });

    http.on('post', this.PREFIX, async function (params: any, body: CreateGameInputDto) {
      const game = createGame.execute(body);
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
