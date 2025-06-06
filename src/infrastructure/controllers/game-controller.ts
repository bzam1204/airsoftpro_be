import {inject, injectable} from "tsyringe";

import CancelGame from "@/application/use-cases/game/cancel-game";
import CreateGame from "@/application/use-cases/game/create-game";
import Login from "@/application/use-cases/auth/login";

import Http from "@/infrastructure/http";

import {CANCEL_GAME, CREATE_GAME, EDIT_GAME, HTTP, LOGIN} from "@/shared/constants/constants";
import EditGame from "@/application/use-cases/game/edit-game";

@injectable()
export default class GameController {
  private readonly PREFIX = '/game';

  constructor(
      @inject(CANCEL_GAME) readonly cancelGame: CancelGame,
      @inject(CREATE_GAME) readonly createGame: CreateGame,
      @inject(EDIT_GAME) readonly editGame: EditGame,
      @inject(LOGIN) readonly login: Login,
      @inject(HTTP) readonly http: Http,
  ) {

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
