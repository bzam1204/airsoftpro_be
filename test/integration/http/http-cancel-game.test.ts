import request from 'supertest';
import ExpressAdapter from "@/infrastructure/express-adapter";
import container from "@/infrastructure/container";
import AuthController from "@/infrastructure/controllers/auth-controller";
import {HASHING_SERVICE, HTTP, TOKEN_PROVIDER, USER_REPOSITORY} from "@/shared/constants/constants";
import UserRepositoryMemory from "@/infrastructure/repositories/user-repository-memory";
import User from "@/domain/entities/user";
import userProps from "@test/shared/user-props";
import PlayerController from "@/infrastructure/controllers/player-controller";
import GameController from "@/infrastructure/controllers/game-controller";
import GameStatus from "@/domain/enums/game-status";

describe('Cancelar Jogo por HTTP', function () {
  let app: ExpressAdapter;

  beforeAll(function () {
    app = new ExpressAdapter();
    container.register(HTTP, {useValue : app});
    container.resolve(GameController);
  });

  it('Deve  cancelar um jogo', async function () {
    const participationData = {gameId: '1'};
    await request(app.getInstance())
        .delete('/game/1')
        .send(participationData)
        .expect(200)
        .expect(res => {
          //TODO: mapear dto de saida para evitar usar atributos privados
          expect(res.body.game._status).toBe(GameStatus.CANCELLED);
        });
  });

});
