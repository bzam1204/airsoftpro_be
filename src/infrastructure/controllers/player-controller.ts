import {inject, injectable} from "tsyringe";

import CreatePlayer from "@/application/use-cases/player/create-player";
import VerifyPlayerName from "@/application/use-cases/player/verify-player-name";
import ViewGivenReportsHistory from "@/application/use-cases/report/view-given-reports-history";
import ViewReceivedReportsHistory from "@/application/use-cases/report/view-received-reports-history";
// TODO: MOVE IT TO GAME CONTROLLER (these imports are still needed for the old routes if not removed)
import AddPlayerParticipation from "@/application/use-cases/game/add-player-participation";
import CancelParticipation from "@/application/use-cases/game/cancel-participation";


import Http from "@/infrastructure/http";

import {
  CREATE_PLAYER,
  HTTP,
  VERIFY_PLAYER_NAME,
  VIEW_GIVEN_REPORTS_HISTORY,
  VIEW_RECEIVED_REPORTS_HISTORY,
  // TODO: MOVE IT TO GAME CONTROLLER (these constants are still needed for the old routes if not removed)
  ADD_PLAYER_PARTICIPATION,
  CANCEL_PARTICIPATION,
} from "@/shared/constants/constants";

@injectable()
export default class PlayerController {
  private readonly PREFIX = '/players';

  constructor(
      @inject(CREATE_PLAYER) readonly createPlayer: CreatePlayer,
      @inject(VERIFY_PLAYER_NAME) readonly verifyPlayerName: VerifyPlayerName,
      @inject(VIEW_GIVEN_REPORTS_HISTORY) readonly viewGivenReportsHistory: ViewGivenReportsHistory,
      @inject(VIEW_RECEIVED_REPORTS_HISTORY) readonly viewReceivedReportsHistory: ViewReceivedReportsHistory,
      @inject(HTTP) readonly http: Http,
      // TODO: MOVE IT TO GAME CONTROLLER (these injections are still needed for the old routes if not removed)
      @inject(ADD_PLAYER_PARTICIPATION) readonly addPlayerParticipation: AddPlayerParticipation,
      @inject(CANCEL_PARTICIPATION) readonly cancelParticipation: CancelParticipation
  ) {

    http.on('post', this.PREFIX, async function (params: any, body: CreatePlayerDto) {
      const player = await createPlayer.execute(body);
      return {player};
    });

    http.on('get', `${this.PREFIX}/verify-name`, async function (params: any, body: any, query: {name?: string}) {
      const name = query.name;
      if (!name) {
        // Or handle as an error, depending on desired behavior for missing query param
        return false;
      }
      const isAvailable = await verifyPlayerName.execute(name);
      return isAvailable;
    });

    http.on('get', `${this.PREFIX}/:playerId/reports/given`, async function (params: {playerId: string}) {
      const playerId = params.playerId;
      const reports = await viewGivenReportsHistory.execute(playerId);
      return reports;
    });

    http.on('get', `${this.PREFIX}/:playerId/reports/received`, async function (params: {playerId: string}) {
      const playerId = params.playerId;
      const reports = await viewReceivedReportsHistory.execute(playerId);
      return reports;
    });

    //TODO: MOVE IT TO GAME CONTROLLER
    const oldPrefix = '/player'; // Using old prefix for these routes for now
    http.on('post', `${oldPrefix}/:id/participations`, async function (params: {id: string}, body: {
      gameId: string;
      playerId: string
    }) {
      const {gameId} = body;
      const playerId = params.id;
      const game = await addPlayerParticipation.execute(gameId, playerId);
      return {game};
    });

    //TODO: MOVE IT TO GAME CONTROLLER
    http.on('delete', `${oldPrefix}/:id/participations`, async function (params: {id: string}, body: {
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

interface CreatePlayerDto {
  userId: string;
  motto: string;
  name: string;
}
