import Http from "@/infrastructure/http";
import RefreshToken from "@/application/use-cases/auth/refresh-token";
import Login from "@/application/use-cases/auth/login";
import RegisterUser from "@/application/use-cases/auth/register-user";
import {inject, injectable} from "tsyringe";
import {CANCEL_GAME, HTTP, LOGIN, REFRESH_TOKEN, REGISTER_USER} from "@/shared/constants/constants";
import CancelGame from "@/application/use-cases/game/cancel-game";

@injectable()
export default class GameController {
  private readonly PREFIX = '/game';

  constructor(
      @inject(CANCEL_GAME) readonly cancelGame: CancelGame,
      @inject(LOGIN) readonly login: Login,
      @inject(HTTP) readonly http: Http,
  ) {

    http.on('delete', `${this.PREFIX}/:id`, async function (params: {id: string}, body: any) {
      const gameId = params.id;
      const game = await cancelGame.execute(gameId);
      return {game};
    });

  };

};

