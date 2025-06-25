import request from 'supertest';

import AccountController from '@/infrastructure/controllers/account-controller';
import ExpressAdapter from '@/infrastructure/express-adapter';
import container from '@/infrastructure/container';

import {HTTP} from '@/shared/constants/constants';

describe('Registrar Usuario por HTTP', function () {
    let app: ExpressAdapter;

    beforeAll(function () {
        app = new ExpressAdapter(container);
        container.register(HTTP, {useValue: app});
        app.registerControllers([AccountController]);
    });

    it('Deve cadastrar um novo usuario', async function () {
        const userData = {
            playerName: 'player1',
            password: '123123',
            fullName: 'player da silva',
            birth: '2000-09-21T08:00:00',
            photo: 'url',
            email: 'player1@test.com',
        };
        await request(app.getInstance())
            .post('/account')
            .send(userData)
            .expect(201)
            .expect(res => {
                const data = res.body.data;
                expect(data.user).toBeDefined();
                expect(data.player).toBeDefined();
                expect(data.accessToken).toBeDefined();
                expect(data.refreshToken).toBeDefined();
            });
    });

});
