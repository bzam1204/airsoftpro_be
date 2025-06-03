import {inject, injectable} from "tsyringe";

import CancelParticipation from "@/application/use-cases/game/cancel-participation";
import AddPlayerParticipation from "@/application/use-cases/game/add-player-participation";

import Http from "@/infrastructure/http";

import {
  ADD_PLAYER_PARTICIPATION,
  HTTP,
  REMOVE_PLAYER_PARTICIPATION
} from "@/shared/constants/constants";

@injectable()
export default class PlayerController {
  private readonly PREFIX = '/player';

  constructor(
      @inject(REMOVE_PLAYER_PARTICIPATION) readonly cancelParticipation: CancelParticipation,
      @inject(ADD_PLAYER_PARTICIPATION) readonly addPlayerParticipation: AddPlayerParticipation,
      @inject(HTTP) readonly http: Http,
  ) {

    http.on('post', `${this.PREFIX}/:id/participations`, async function (params: {id: string}, body: {
      gameId: string;
      playerId: string
    }) {
      const {gameId} = body;
      const playerId = params.id;
      const game = await addPlayerParticipation.execute(gameId, playerId);
      return {game};
    });
    
    http.on('delete', `${this.PREFIX}/:id/participations`, async function (params: {id: string}, body: {
      gameId: string;
      playerId: string
    }) {
      const {gameId} = body;
      const playerId = params.id;
      const game = await cancelParticipation.execute(gameId, playerId);
      return {game};
    });

  };

};
