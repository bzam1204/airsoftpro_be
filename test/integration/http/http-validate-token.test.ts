import request from 'supertest';

import ExpressAdapter from "@/infrastructure/express-adapter";
import AuthController from "@/infrastructure/controllers/auth-controller";
import container from "@/infrastructure/container";

import {HTTP, TOKEN_PROVIDER} from "@/shared/constants/constants";

describe('Validar Token por HTTP', function () {
  let app: ExpressAdapter;

  beforeAll(function () {
    app = new ExpressAdapter(container);
    container.register(HTTP, {useValue : app});
    container.register(TOKEN_PROVIDER, {
      useValue : {
        signAccessToken : jest.fn(),
        signRefreshToken : jest.fn(),
        verifyAccessToken : (token: string) => token === 'valid_token',
        verifyRefreshToken : (token: string) => token === 'valid_token',
        decode : jest.fn(),
      }
    });
    app.registerControllers([AuthController]);
  });

  it('Deve validar um token válido', async function () {
    await request(app.getInstance())
        .post('/auth/validate-token')
        .send({token: 'valid_token'})
        .expect(200)
        .expect(res => {
          expect(res.body.data.valid).toBe(true);
        });
  });

  it('Deve invalidar um token inválido', async function () {
    await request(app.getInstance())
        .post('/auth/validate-token')
        .send({token: 'invalid_token'})
        .expect(200)
        .expect(res => {
          expect(res.body.data.valid).toBe(false);
        });
  });
});
