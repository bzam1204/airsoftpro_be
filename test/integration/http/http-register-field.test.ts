import request from 'supertest';

import Admin from "@/domain/entities/admin";

import FieldRepositoryMemory from "@/infrastructure/repositories/field-repository-memory";
import AdminRepositoryMemory from "@/infrastructure/repositories/admin-repository-memory";
import FieldController from "@/infrastructure/controllers/field-controller";
import ExpressAdapter from "@/infrastructure/express-adapter";

import container from "@/infrastructure/container";

import {ADMIN_REPOSITORY, FIELD_REPOSITORY, HTTP, ID_GENERATOR} from "@/shared/constants/constants";

describe('Registrar Campo por HTTP', function () {
  let app: ExpressAdapter;

  beforeAll(function () {
    app = new ExpressAdapter(container);
    container.register(HTTP, {useValue : app});
    container.register(ADMIN_REPOSITORY, {
      useValue : new AdminRepositoryMemory([new Admin({name : 'Admin 1', id : '1'})])
    });
    container.register(FIELD_REPOSITORY, {useValue : new FieldRepositoryMemory()});
    container.register(ID_GENERATOR, {useValue : {generate : () => '1'}});
    container.resolve(FieldController);
  });

  it('Deve registrar um campo', async function () {
    const fieldData = {
      infrastructure : 'bath',
      description : 'incredible',
      address : 'rua x, n 1234, bairro y',
      adminId : '1',
      photos : [''],
      rules : 'cannot highland',
      name : 'awesome field'
    };

    await request(app.getInstance())
        .post('/field')
        .send(fieldData)
        .expect(200)
        .expect(res => {
          //TODO: ADD OUTPUT DTO TO SOLVE THE DATA PRESENTATION PROBLEM
          expect(res.body.field).toBeDefined();
          expect(res.body.field._id).toBe('1');
        });
  });

});
