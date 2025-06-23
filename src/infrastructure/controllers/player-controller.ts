import {inject, injectable} from 'tsyringe';

import AddPlayerParticipation from '@/application/use-cases/game/add-player-participation';
import CancelParticipation from '@/application/use-cases/game/cancel-participation';
import VerifyPlayerName from '@/application/use-cases/player/verify-player-name';
import CreatePlayer from '@/application/use-cases/player/create-player';

import Http from '@/infrastructure/http';

import {
    ADD_PLAYER_PARTICIPATION,
    CANCEL_PARTICIPATION,
    VERIFY_PLAYER_NAME,
    CREATE_PLAYER,
    HTTP,
} from '@/shared/constants/constants';

@injectable()
export default class PlayerController {
    private readonly PREFIX = '/player';

    constructor(
        @inject(ADD_PLAYER_PARTICIPATION) readonly addPlayerParticipation: AddPlayerParticipation,
        @inject(CANCEL_PARTICIPATION) readonly cancelParticipation: CancelParticipation,
        @inject(VERIFY_PLAYER_NAME) readonly verifyPlayerName: VerifyPlayerName,
        @inject(CREATE_PLAYER) readonly createPlayer: CreatePlayer,
        @inject(HTTP) readonly http: Http,
    ) {
        http.on('get', `${this.PREFIX}/verify-name/:name`, async function (params: {name: string}) {
            const name = params.name;
            const available = await verifyPlayerName.execute(name);
            return {available};
        });

        http.on('post', this.PREFIX, async function (params: any, body: CreatePlayerInputDto) {
            const player = await createPlayer.execute(body);
            return {player};
        });

        http.on('post', `${this.PREFIX}/:id/participations`, async function (params: {
            id: string
        }, body: AddParticipationInputDto) {
            const playerId = params.id;
            const gameId = body.gameId;
            const game = await addPlayerParticipation.execute(gameId, playerId);
            return {game};
        });

        http.on('delete', `${this.PREFIX}/:id/participations`, async function (params: {
            id: string
        }, body: CancelParticipationInputDto) {
            const playerId = params.id;
            const gameId = body.gameId;
            const game = await cancelParticipation.execute(gameId, playerId);
            return {game};
        });
    }
}

interface CreatePlayerInputDto {
    userId: string;
    name: string;
    motto?: string;
}

interface AddParticipationInputDto {
    gameId: string;
}

interface CancelParticipationInputDto {
    gameId: string;
}
