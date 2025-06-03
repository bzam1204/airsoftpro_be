import request from 'supertest';

import AuthController from "@/infrastructure/controllers/auth-controller";
import ExpressAdapter from "@/infrastructure/express-adapter";
import container from "@/infrastructure/container";

import {HTTP, TOKEN_PROVIDER, VALIDATE_TOKEN} from "@/shared/constants/constants";

describe('Renovar Token por HTTP', function () {
  let app: ExpressAdapter;

  beforeAll(function () {
    app = new ExpressAdapter();
    container.register(HTTP, {useValue : app});
    container.register(TOKEN_PROVIDER, {useValue: {
        signAccessToken : () => '123123',
        signRefreshToken : () => '321321',
        verifyRefreshToken : () => true,
        decode : () => ({sub: '1', email: ''}),
      }});
    container.register(VALIDATE_TOKEN, {useValue: {execute: () => Promise.resolve(true)}});
    container.resolve(AuthController);
  });

  it('Deve renovar o token', async function () {
    const requestData = {token: '321321'};
    await request(app.getInstance())
        .post('/auth/refresh-token')
        .send(requestData)
        .expect(200)
        .expect(res => {
          expect(res.body.accessToken).toBe('123123');
          expect(res.body.refreshToken).toBe('321321');
        });
  });

});
