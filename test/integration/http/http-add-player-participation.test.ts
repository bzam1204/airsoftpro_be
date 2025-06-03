import request from 'supertest';
import ExpressAdapter from "@/infrastructure/express-adapter";
import container from "@/infrastructure/container";
import AuthController from "@/infrastructure/controllers/auth-controller";
import {HASHING_SERVICE, HTTP, TOKEN_PROVIDER, USER_REPOSITORY} from "@/shared/constants/constants";
import UserRepositoryMemory from "@/infrastructure/repositories/user-repository-memory";
import User from "@/domain/entities/user";
import userProps from "@test/shared/user-props";
import PlayerController from "@/infrastructure/controllers/player-controller";

describe('Adicionar participação por HTTP', function () {
  let app: ExpressAdapter;

  beforeAll(function () {
    app = new ExpressAdapter();
    container.register(HTTP, {useValue : app});
    container.resolve(PlayerController);
  });

  it('Deve adicionar participação', async function () {
    const participationData = {gameId: '1'};
    await request(app.getInstance())
        .post('/player/1/participations')
        .send(participationData)
        .expect(200)
        .expect(res => {
          expect(res.body.game).toBeDefined();
        });
  });

});
