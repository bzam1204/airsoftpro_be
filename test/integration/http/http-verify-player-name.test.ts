import request from 'supertest';

import Player from "@/domain/entities/player";

import PlayerRepositoryMemory from "@/infrastructure/repositories/player-repository-memory";
import PlayerController from "@/infrastructure/controllers/player-controller";
import ExpressAdapter from "@/infrastructure/express-adapter";
import container from "@/infrastructure/container";

import {HTTP, PLAYER_REPOSITORY} from "@/shared/constants/constants";


import playerProps from "@test/shared/player-props";

describe('Verificar disponibilidade do nome de jogador por HTTP', function () {
  let app: ExpressAdapter;

  beforeAll(function () {
    app = new ExpressAdapter(container);
    container.register(HTTP, {useValue: app});
    container.register(PLAYER_REPOSITORY, {
      useValue: new PlayerRepositoryMemory([new Player({...playerProps, name: 'used_name'})])
    });
    container.resolve(PlayerController);
  });

  it('Deve retornar true se o nome estiver disponível', async function () {
    await request(app.getInstance())
      .get('/player/verify-name/available_name')
      .expect(200)
      .expect(res => {
        expect(res.body.available).toBe(true);
      });
  });

  it('Deve retornar false se o nome estiver sendo usado', async function () {
    await request(app.getInstance())
      .get('/player/verify-name/used_name')
      .expect(200)
      .expect(res => {
        expect(res.body.available).toBe(false);
      });
  });

});
