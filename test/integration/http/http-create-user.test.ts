import request from 'supertest';

import AccountController from "@/infrastructure/controllers/account-controller";
import ExpressAdapter from "@/infrastructure/express-adapter";
import container from "@/infrastructure/container";

import {HTTP} from "@/shared/constants/constants";

describe('Criar Usuário por HTTP', function () {
  let app: ExpressAdapter;

  beforeAll(function () {
    app = new ExpressAdapter();
    container.register(HTTP, {useValue : app});
    container.resolve(AccountController);
  });

  it('Deve criar um usuário', async function () {
    const data = {
      playerName : "gabyludo",
      password : "123123",
      fullName : "gabrielly figueira",
      birth : "2000-09-21T08:00:00",
      photo : "",
      email : "gaby@airsoftpro.com"
    };
    await request(app.getInstance())
        .post('/account')
        .send(data)
        .expect(200)
        .expect(res => {
          expect(res.body.user).toBeDefined();
        });
  });

});
