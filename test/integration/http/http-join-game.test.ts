import request from 'supertest';

import GameStatus from "@/domain/enums/game-status";
import Player from "@/domain/entities/player";
import Game from "@/domain/entities/game";

import PlayerRepositoryMemory from "@/infrastructure/repositories/player-repository-memory";
import GameRepositoryMemory from "@/infrastructure/repositories/game-repository-memory";
import GameController from "@/infrastructure/controllers/game-controller";
import ExpressAdapter from "@/infrastructure/express-adapter";
import container from "@/infrastructure/container";

import {GAME_REPOSITORY, HTTP, PLAYER_REPOSITORY} from "@/shared/constants/constants";

import playerProps from "@test/shared/player-props";
import gameProps from "@test/shared/game-props";

describe('Entrar na Partida por HTTP', function () {
  let app: ExpressAdapter;

  beforeAll(function () {
    app = new ExpressAdapter();
    container.register(HTTP, {useValue : app});
    container.register(GAME_REPOSITORY, {
      useValue : new GameRepositoryMemory([new Game({...gameProps, status : GameStatus.SCHEDULED})])
    });
    container.register(PLAYER_REPOSITORY, {useValue : new PlayerRepositoryMemory([new Player(playerProps)])});
    container.resolve(GameController);
  });

  it('Deve inscrever um jogador em uma partida', async function () {
    await request(app.getInstance())
        .post('/game/1/join')
        .send({playerId : '1'})
        .expect(200)
        .expect(res => {
          expect(res.body.game._playerList).toContain('1');
          expect(res.body.game).toBeDefined();
        });
  });

});
