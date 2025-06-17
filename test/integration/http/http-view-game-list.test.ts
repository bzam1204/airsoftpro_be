import request from 'supertest';

import Game from "@/domain/entities/game";

import GameRepositoryMemory from "@/infrastructure/repositories/game-repository-memory";
import GameController from "@/infrastructure/controllers/game-controller";
import ExpressAdapter from "@/infrastructure/express-adapter";
import container from "@/infrastructure/container";

import {GAME_REPOSITORY, HTTP} from "@/shared/constants/constants";

import gameProps from "@test/shared/game-props";

describe('Ver Lista de Partidas por HTTP', function () {
    let app: ExpressAdapter;

    beforeAll(function () {
        app = new ExpressAdapter();
        const testContainer = container.createChildContainer();
        testContainer.register(HTTP, {useValue: app});
        testContainer.register(GAME_REPOSITORY, {
            useValue: new GameRepositoryMemory([
                new Game({...gameProps, id: '1'}),
                new Game({...gameProps, id: '2'}),
                new Game({...gameProps, id: '3'})
            ])
        });
        testContainer.resolve(GameController);
    });

    it('Deve listar todas as partidas', async function () {
        await request(app.getInstance())
            .get('/game')
            .expect(200)
            .expect(res => {
                expect(res.body.games).toBeDefined();
                expect(res.body.games.length).toBe(3);
            });
    });

    it('Deve retornar lista vazia quando não houver partidas', async function () {
        const _container = container.createChildContainer()
        _container.register(GAME_REPOSITORY, {
            useValue: new GameRepositoryMemory([])
        });
        const _app = new ExpressAdapter();
        _container.register(HTTP, {useValue: _app});
        _container.resolve(GameController);
        await request(_app.getInstance())
            .get('/game')
            .expect(200)
            .expect(res => {
                expect(res.body.games).toBeDefined();
                expect(res.body.games.length).toBe(0);
            });
    });

});
