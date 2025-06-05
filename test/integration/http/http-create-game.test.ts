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

describe('Criar Partida por HTTP', function () {
  let app: ExpressAdapter;

  beforeAll(function () {
    app = new ExpressAdapter();
    container.register(HTTP, {useValue : app});
    container.resolve(GameController);
  });

  it('Deve criar uma partida', async function () {
    const data = {
      specificRules : 'regra 1 - tatata',
      minHonorLevel : 3,
      playersLimit : 10,
      description : 'uma partida sem precedentes',
      friendlyFire : true,
      startDate : '2025-06-20T15:00:00',
      fpsLimit: 400,
      gameMode : 'MILSIM',
      fieldId: '1',
    };
    await request(app.getInstance())
        .post('/game')
        .send(data)
        .expect(200)
        .expect(res => {
          expect(res.body.game).toBeDefined();
        });
  });

});
