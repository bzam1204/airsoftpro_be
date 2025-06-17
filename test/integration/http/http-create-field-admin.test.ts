import request from 'supertest';

import User from "@/domain/entities/user";

import UserRepositoryMemory from "@/infrastructure/repositories/user-repository-memory";
import AccountController from "@/infrastructure/controllers/account-controller";
import ExpressAdapter from "@/infrastructure/express-adapter";
import container from "@/infrastructure/container";

import {HTTP, USER_REPOSITORY} from "@/shared/constants/constants";

import userProps from "@test/shared/user-props";

describe('Criar Administrador de Campo por HTTP', function () {
  let app: ExpressAdapter;

  beforeAll(function () {
    app = new ExpressAdapter();
    container.register(HTTP, {useValue : app});
    container.register(USER_REPOSITORY, {useValue : new UserRepositoryMemory([new User({...userProps, id : '1'})])});
    container.resolve(AccountController);
  });

  it('Deve adicionar participação', async function () {
    const participationData = {userId : '1'};
    await request(app.getInstance())
        .post('/account/field-admin')
        .send(participationData)
        .expect(200)
        .expect(res => {
          //TODO: mapear dtos de saida para evitar usar atributos privados
          expect(res.body.fieldAdmin._userId).toBe('1');
        });
  });

});
