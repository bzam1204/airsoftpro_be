import request from 'supertest';

import ReportMotivation from "@/domain/enums/report-motivation";
import GameStatus from "@/domain/enums/game-status";
import Game from "@/domain/entities/game";

import GameRepositoryMemory from "@/infrastructure/repositories/game-repository-memory";
import ReportController from "@/infrastructure/controllers/report-controller";
import ExpressAdapter from "@/infrastructure/express-adapter";
import container from "@/infrastructure/container";

import {GAME_REPOSITORY, HTTP} from "@/shared/constants/constants";

import gameProps from "@test/shared/game-props";

describe('Criar Denúncia por HTTP', function () {
  let app: ExpressAdapter;

  beforeAll(function () {
    app = new ExpressAdapter(container);
    container.register(HTTP, {useValue : app});
    container.register(GAME_REPOSITORY, {
      useValue : new GameRepositoryMemory([new Game({
        ...gameProps,
        playerList : ['1', '2'],
        status : GameStatus.FINISHED
      })])
    })
    container.resolve(ReportController);
  });

  it('Deve criar uma denúncia', async function () {
    const data = {
      motivation : ReportMotivation.HIGHLANDER,
      gameId : '1',
      from : '2',
      to : '1',
    };
    await request(app.getInstance())
        .post('/report')
        .send(data)
        .expect(200)
        .expect(res => {
          expect(res.body.report).toBeDefined();
        });
  });

});
