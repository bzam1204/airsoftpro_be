import request from 'supertest';

import PlayerController from '@/infrastructure/controllers/player-controller';
import ExpressAdapter from '@/infrastructure/express-adapter';
import container from '@/infrastructure/container';

import {HTTP} from '@/shared/constants/constants';

describe('Adicionar participação por HTTP', function () {
    let app: ExpressAdapter;

    beforeAll(function () {
        app = new ExpressAdapter(container);
        container.register(HTTP, {useValue: app});
        container.resolve(PlayerController);
    });

    it('Deve adicionar participação', async function () {
        const participationData = {gameId: '1'};
        await request(app.getInstance())
            .post('/player/1/participations')
            .send(participationData)
            .expect(200)
            .expect(res => {
                expect(res.body.game).toBeDefined();
            });
    });

});
