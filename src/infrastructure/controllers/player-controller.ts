import {inject, injectable} from "tsyringe";

import CancelParticipation from "@/application/use-cases/game/cancel-participation";
import AddPlayerParticipation from "@/application/use-cases/game/add-player-participation";

import Http from "@/infrastructure/http";

import {
  ADD_PLAYER_PARTICIPATION, CREATE_PLAYER,
  HTTP,
  CANCEL_PARTICIPATION
} from "@/shared/constants/constants";
import CreatePlayer from "@/application/use-cases/player/create-player";

@injectable()
export default class PlayerController {
  private readonly PREFIX = '/player';

  constructor(
      @inject(ADD_PLAYER_PARTICIPATION) readonly addPlayerParticipation: AddPlayerParticipation,
      @inject(CANCEL_PARTICIPATION) readonly cancelParticipation: CancelParticipation,
      @inject(CREATE_PLAYER) readonly createPlayer: CreatePlayer,
      @inject(HTTP) readonly http: Http,
  ) {

    http.on('post', this.PREFIX, async function (params: any, body: CreatePlayerInputDto) {
      const player = await createPlayer.execute(body);
      return {player};
    });

    //TODO: MOVE IT TO GAME CONTROLLER
    http.on('post', `${this.PREFIX}/:id/participations`, async function (params: {id: string}, body: {
      gameId: string;
      playerId: string
    }) {
      const {gameId} = body;
      const playerId = params.id;
      const game = await addPlayerParticipation.execute(gameId, playerId);
      return {game};
    });

    //TODO: MOVE IT TO GAME CONTROLLER
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

interface CreatePlayerInputDto {
  userId: string;
  motto?: string;
  name: string;
}
