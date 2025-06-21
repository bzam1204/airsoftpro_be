import request from 'supertest';

import ExpressAdapter from '@/infrastructure/express-adapter';
import GameController from '@/infrastructure/controllers/game-controller';
import container from '@/infrastructure/container';

import {HTTP} from '@/shared/constants/constants';

describe('Criar Partida por HTTP', function () {
    let app: ExpressAdapter;

    beforeAll(function () {
        app = new ExpressAdapter();
        container.register(HTTP, {useValue: app});
        container.resolve(GameController);
    });

    it('Deve criar uma partida', async function () {
        const data = {
            specificRules: 'regra 1 - tatata',
            minHonorLevel: 3,
            playersLimit: 10,
            friendlyFire: true,
            description: 'uma partida sem precedentes',
            startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
            fpsLimit: 400,
            gameMode: 'MILSIM',
            fieldId: '1',
        };
        await request(app.getInstance())
            .post('/game')
            .send(data)
            .expect(200)
            .expect(res => {
                expect(res.body.game).toBeDefined();
            });
    });

});
