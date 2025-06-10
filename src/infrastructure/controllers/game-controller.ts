import {inject, injectable} from "tsyringe";

import ViewGameList from "@/application/use-cases/game/view-game-list";
import CancelGame from "@/application/use-cases/game/cancel-game";
import CreateGame from "@/application/use-cases/game/create-game";
import FinishGame from "@/application/use-cases/game/finish-game";
import StartGame from "@/application/use-cases/game/start-game";
import EditGame from "@/application/use-cases/game/edit-game";
import JoinGame from "@/application/use-cases/game/join-game";
import ViewGame from "@/application/use-cases/game/view-game";
import Login from "@/application/use-cases/auth/login";

import Http from "@/infrastructure/http";

import {
    VIEW_GAME_LIST,
    CANCEL_GAME,
    CREATE_GAME,
    FINISH_GAME,
    JOIN_GAME,
    START_GAME,
    VIEW_GAME,
    EDIT_GAME,
    LOGIN,
    HTTP,
} from "@/shared/constants/constants";

@injectable()
export default class GameController {
    private readonly PREFIX = '/game';

    constructor(
        @inject(VIEW_GAME_LIST) readonly viewGameList: ViewGameList,
        @inject(FINISH_GAME) readonly finishGame: FinishGame,
        @inject(CANCEL_GAME) readonly cancelGame: CancelGame,
        @inject(CREATE_GAME) readonly createGame: CreateGame,
        @inject(START_GAME) readonly startGame: StartGame,
        @inject(EDIT_GAME) readonly editGame: EditGame,
        @inject(JOIN_GAME) readonly joinGame: JoinGame,
        @inject(VIEW_GAME) readonly viewGame: ViewGame,
        @inject(LOGIN) readonly login: Login,
        @inject(HTTP) readonly http: Http,
    ) {

        http.on('get', this.PREFIX, async function () {
            const games = await viewGameList.execute();
            return {games};
        });

        http.on('get', `${this.PREFIX}/:id`, async function (params: { id: string }, body: any) {
            const gameId = params.id;
            const game = await viewGame.execute(gameId);
            return {game};
        });

        http.on('post', `${this.PREFIX}/:id/finish`, async function (params: { id: string }, body: any) {
            const gameId = params.id;
            const game = await finishGame.execute(gameId);
            return {game};
        });

        http.on('post', `${this.PREFIX}/:id/start`, async function (params: { id: string }) {
            const gameId = params.id;
            const game = await startGame.execute(gameId);
            return {game};
        });

        http.on('delete', `${this.PREFIX}/:id`, async function (params: { id: string }) {
            const gameId = params.id;
            const game = await cancelGame.execute(gameId);
            return {game};
        });

        http.on('put', `${this.PREFIX}/:id`, async function (params: { id: string }, body: EditGameInputDto) {
            const id = params.id;
            const game = await editGame.execute({
                ...body,
                id,
                startDate: body.startDate ? new Date(body.startDate) : body.startDate,
            });
            return {game};
        });

        http.on('post', this.PREFIX, async function (params: any, body: CreateGameInputDto) {
            const game = await createGame.execute({...body, startDate: new Date(body.startDate)});
            return {game};
        });

        http.on('post', `${this.PREFIX}/:id/join`, async function (params: { id: string }, body: JoinGameInputDto) {
            const gameId = params.id;
            const playerId = body.playerId;
            const game = await joinGame.execute(gameId, playerId);
            return {game};
        });
    }
}

interface CreateGameInputDto {
    specificRules?: string,
    minHonorLevel: number,
    playersLimit: number,
    friendlyFire: boolean,
    description?: string,
    startDate: Date,
    fpsLimit?: number,
    gameMode: string,
    fieldId: string,
}

interface EditGameInputDto {
    specificRules?: string;
    minHonorLevel?: number;
    playersLimit?: number;
    friendlyFire?: boolean;
    description?: string;
    startDate?: Date;
    fpsLimit?: number;
    gameMode?: string;
    fieldId?: string;
}

interface JoinGameInputDto {
    playerId: string;
}
