import request from 'supertest';

import GameController from '@/infrastructure/controllers/game-controller';
import ExpressAdapter from '@/infrastructure/express-adapter';
import container from '@/infrastructure/container';

import {HTTP} from '@/shared/constants/constants';

describe('Editar Partida por HTTP', function () {
    let app: ExpressAdapter;

    beforeAll(function () {
        app = new ExpressAdapter(container);
        container.register(HTTP, {useValue: app});
        app.registerControllers([GameController]);
    });

    it('Deve editar as informações de uma partida', async function () {
        const data = {
            specificRules: 'new rule',
            minHonorLevel: 2,
            playersLimit: 4,
            friendlyFire: true,
            description: 'new description',
            startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
            fpsLimit: 234,
            gameMode: 'team deathmatch',
            fieldId: '2',
        };
        await request(app.getInstance())
            .put('/game/1')
            .send(data)
            .expect(200)
            .expect(res => {
                expect(res.body.game).toBeDefined();
            });
    });

});
