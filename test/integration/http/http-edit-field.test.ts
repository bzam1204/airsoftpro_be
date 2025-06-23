import request from 'supertest';

import FieldController from "@/infrastructure/controllers/field-controller";
import ExpressAdapter from "@/infrastructure/express-adapter";
import container from "@/infrastructure/container";

import {HTTP} from "@/shared/constants/constants";

describe('Editar Campo por HTTP', function () {
  let app: ExpressAdapter;

  beforeAll(function () {
    app = new ExpressAdapter(container);
    container.register(HTTP, {useValue : app});
    container.resolve(FieldController);
  });

  it('Should successfully edit field information with valid data', async function () {
    const data = {
      infrastructure: 'pool,sauna,toilet',
      description: 'the king, the power the best',
      coordinates: '1.1.1.1',
      address: 'rua do campo, 123',
      photos : ['https://example.com/image.jpg'],
      rules : 'No smoking, no food',
      name : 'Premium Field',
    };
    await request(app.getInstance())
        .put('/field/1')
        .send(data)
        .expect(200)
        .expect(res => {
          expect(res.body.field).toBeDefined();
          expect(res.body.field._name).toBe('Premium Field');
          expect(res.body.field.fieldDetails._description).toBe(data.description);
        });
  });

});
