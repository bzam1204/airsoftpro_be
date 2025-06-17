import {inject, injectable} from "tsyringe";
import {Request} from "express";

import ViewGameList from "@/application/use-cases/game/view-game-list";
import CancelGame from "@/application/use-cases/game/cancel-game";
import CreateGame from "@/application/use-cases/game/create-game";
import FinishGame from "@/application/use-cases/game/finish-game";
import StartGame from "@/application/use-cases/game/start-game";
import EditGame from "@/application/use-cases/game/edit-game";
import JoinGame from "@/application/use-cases/game/join-game";
import ViewGame from "@/application/use-cases/game/view-game";

import {EditGameInputDto, EditGameOutputDto} from "@/infrastructure/dtos/edit-game-dto";
import {CreateGameInputDto} from "@/infrastructure/dtos/create-game-dto";
import {JoinGameInputDto} from "@/infrastructure/dtos/join-game-dto";
import GameMapper from "@/infrastructure/mappers/game.mapper";
import TokenGuard from "@/infrastructure/token-guard";
import UseGuards from "@/infrastructure/use-guards";
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
    HTTP,
} from "@/shared/constants/constants";

@injectable()
export default class GameController {
    private readonly PREFIX = '/game';

    constructor(
        @inject(VIEW_GAME_LIST) private readonly _viewGameList: ViewGameList,
        @inject(FINISH_GAME) private readonly _finishGame: FinishGame,
        @inject(CANCEL_GAME) private readonly _cancelGame: CancelGame,
        @inject(CREATE_GAME) private readonly _createGame: CreateGame,
        @inject(START_GAME) private readonly _startGame: StartGame,
        @inject(EDIT_GAME) private readonly _editGame: EditGame,
        @inject(VIEW_GAME) private readonly _viewGame: ViewGame,
        @inject(JOIN_GAME) private readonly _joinGame: JoinGame,
        @inject(HTTP) private readonly _http: Http,
    ) {
        this._http.route('delete', `${this.PREFIX}/:id`, this.cancelGame.bind(this));
        this._http.route('post', `${this.PREFIX}/:id/finish`, this.finishGame.bind(this));
        this._http.route('post', `${this.PREFIX}/:id/start`, this.startGame.bind(this));
        this._http.route('post', this.PREFIX, this.createGame.bind(this));
        this._http.route('post', `${this.PREFIX}/:id/join`, this.joinGame.bind(this));
        this._http.route('put', `${this.PREFIX}/:id`, this.editGame.bind(this));
        this._http.route('get', this.PREFIX, this.viewGameList.bind(this));
        this._http.route('get', `${this.PREFIX}/:id`, this.viewGame.bind(this));
    };

    async viewGameList() {
        const games = await this._viewGameList.execute();
        return {games};
    };

    async viewGame(request: Request) {
        const gameId = request.params.id;
        const game = await this._viewGame.execute(gameId);
        return {game};
    };

    async startGame(request: Request) {
        const gameId = request.params.id;
        const game = await this._startGame.execute(gameId);
        return {game};
    };

    async finishGame(request: Request) {
        const gameId = request.params.id;
        const game = await this._finishGame.execute(gameId);
        return {game};
    };

    async cancelGame(request: Request) {
        const gameId = request.params.id;
        const game = await this._cancelGame.execute(gameId);
        return {game};
    };

    async editGame(request: Request): Promise<EditGameOutputDto> {
        const id = request.params.id;
        const requestInput: EditGameInputDto = request.body;
        const useCaseInput = {
            ...requestInput, id,
            startDate: requestInput.startDate ? new Date(requestInput.startDate) : requestInput.startDate,
        };
        const game = await this._editGame.execute(useCaseInput);
        return {game: GameMapper.toDto(game)};
    };

    @UseGuards(TokenGuard)
    async createGame(request: Request) {
        const body: CreateGameInputDto = request.body;
        const game = this._createGame.execute({...body, startDate: new Date(body.startDate)});
        return {game};
    };

    async joinGame(request: Request) {
        const gameId = request.params.id;
        const {playerId}: JoinGameInputDto = request.body;
        const game = await this._joinGame.execute(gameId, playerId);
        return {game};
    };

};
