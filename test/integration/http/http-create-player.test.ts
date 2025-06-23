import request from 'supertest';
import ExpressAdapter from "@/infrastructure/express-adapter";
import container from "@/infrastructure/container";
import {HTTP, PLAYER_REPOSITORY, USER_REPOSITORY} from "@/shared/constants/constants";
import UserRepositoryMemory from "@/infrastructure/repositories/user-repository-memory";
import User from "@/domain/entities/user";
import userProps from "@test/shared/user-props";
import PlayerController from "@/infrastructure/controllers/player-controller";
import PlayerRepositoryMemory from "@/infrastructure/repositories/player-repository-memory";
import Player from "@/domain/entities/player";

describe('Criar Jogador por HTTP', function () {
  let app: ExpressAdapter;

  beforeAll(function () {
    app = new ExpressAdapter(container);
    container.register(HTTP, {useValue : app});
    container.register(USER_REPOSITORY, {useValue : new UserRepositoryMemory([new User({...userProps, id : '1',})])});
    container.register(PLAYER_REPOSITORY, {useValue : new PlayerRepositoryMemory([])});
    container.resolve(PlayerController);
  });

  it('Deve criar um jogador', async function () {
    const data = {userId : '1', motto : 'A vida só é dura pra quem é mole.', name : 'Zamorano',};
    await request(app.getInstance())
        .post('/player')
        .send(data)
        .expect(200)
        .expect(res => {
          expect(res.body.player).toBeDefined();
        });
  });

});
