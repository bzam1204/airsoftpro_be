import request from 'supertest';

import AccountController from "@/infrastructure/controllers/account-controller";
import ExpressAdapter from "@/infrastructure/express-adapter";
import container from "@/infrastructure/container";

import {HTTP} from "@/shared/constants/constants";

describe('Registrar Usuario por HTTP', function () {
  let app: ExpressAdapter;

  beforeAll(function () {
    app = new ExpressAdapter();
    container.register(HTTP, {useValue : app});
    container.resolve(AccountController);
  });

  it('Deve cadastrar um novo usuario', async function () {
    const userData = {
      playerName : 'player1',
      password : '123123',
      fullName : 'player da silva',
      birth : '2000-09-21T08:00:00',
      photo : 'url',
      email : 'player1@test.com',
    };
    await request(app.getInstance())
        .post('/account')
        .send(userData)
        .expect(200)
        .expect(res => {
          expect(res.body.user).toBeDefined();
          expect(res.body.player).toBeDefined();
          expect(res.body.accessToken).toBeDefined();
          expect(res.body.refreshToken).toBeDefined();
        });
  });

});
