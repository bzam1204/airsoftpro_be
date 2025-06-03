import request from 'supertest';
import ExpressAdapter from "@/infrastructure/express-adapter";
import container from "@/infrastructure/container";
import AuthController from "@/infrastructure/controllers/auth-controller";
import {GAME_REPOSITORY, HASHING_SERVICE, HTTP, TOKEN_PROVIDER, USER_REPOSITORY} from "@/shared/constants/constants";
import UserRepositoryMemory from "@/infrastructure/repositories/user-repository-memory";
import User from "@/domain/entities/user";
import userProps from "@test/shared/user-props";
import PlayerController from "@/infrastructure/controllers/player-controller";
import GameRepositoryMemory from "@/infrastructure/repositories/game-repository-memory";
import Game from "@/domain/entities/game";
import gameProps from "@test/shared/game-props";

describe('Cancelar participação por HTTP', function () {
  let app: ExpressAdapter;

  beforeAll(function () {
    app = new ExpressAdapter();
    container.register(HTTP, {useValue : app});
    container.register(GAME_REPOSITORY, {useValue: new GameRepositoryMemory([ new Game({...gameProps, id: '1', playerList: ['1']})])});
    container.resolve(PlayerController);
  });

  it('Deve cancelar participação', async function () {
    const participationData = {gameId: '1'};
    await request(app.getInstance())
        .delete('/player/1/participations')
        .send(participationData)
        .expect(200)
        .expect(res => {
          expect(res.body.game).toBeDefined();
          //TODO: mapear dto de saida para evitar usar atributos privados
          expect(res.body.game._playerList.length).toBe(0);
        });
  });

});
