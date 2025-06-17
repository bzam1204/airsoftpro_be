import request from 'supertest';

import User from "@/domain/entities/user";

import UserRepositoryMemory from "@/infrastructure/repositories/user-repository-memory";
import ExpressAdapter from "@/infrastructure/express-adapter";
import AuthController from "@/infrastructure/controllers/auth-controller";
import container from "@/infrastructure/container";

import {HASHING_SERVICE, HTTP, TOKEN_PROVIDER, USER_REPOSITORY} from "@/shared/constants/constants";

import userProps from "@test/shared/user-props";

describe('Entrar no sistema por HTTP', function () {
  let app: ExpressAdapter;

  beforeAll(function () {
    app = new ExpressAdapter();
    container.register(HTTP, {useValue : app});
    container.register(USER_REPOSITORY, {
      useValue : new UserRepositoryMemory([new User({
        ...userProps,
        id : '1',
        email : 'user@example.com',
        password : '123123'
      })])
    });
    container.register(HASHING_SERVICE, {useValue : {hash : () => jest.fn(), compare : () => Promise.resolve(true)}});
    container.register(TOKEN_PROVIDER, {
      useValue : {
        signAccessToken : () => '123123',
        signRefreshToken : () => '321321',
      }
    });
    container.resolve(AuthController);
  });

  it('Deve entrar no sistema', async function () {
    const credentials = {email : 'user@example.com', password : '123123'};
    await request(app.getInstance())
        .post('/auth/login')
        .send(credentials)
        .expect(200)
        .expect(res => {
          expect(res.body.accessToken).toBe('123123');
          expect(res.body.refreshToken).toBe('321321');
        });
  });

});
