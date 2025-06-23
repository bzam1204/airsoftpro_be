import {inject, injectable} from 'tsyringe';

import ViewGameList from '@/application/use-cases/game/view-game-list';
import CancelGame from '@/application/use-cases/game/cancel-game';
import CreateGame from '@/application/use-cases/game/create-game';
import FinishGame from '@/application/use-cases/game/finish-game';
import StartGame from '@/application/use-cases/game/start-game';
import EditGame from '@/application/use-cases/game/edit-game';
import JoinGame from '@/application/use-cases/game/join-game';
import ViewGame from '@/application/use-cases/game/view-game';

import {EditGameInputDto, EditGameOutputDto} from '@/infrastructure/dtos/edit-game.dto';
import {Delete, Get, Post, Put} from '@/infrastructure/decorators/routes.decorator';
import {CreateGameInputDto} from '@/infrastructure/dtos/create-game.dto';
import {Body, Params} from '@/infrastructure/decorators/parameter.decorator';
import Controller from '@/infrastructure/decorators/controller.decorator';
import GameMapper from '@/infrastructure/mappers/game.mapper';

import {
    VIEW_GAME_LIST,
    CANCEL_GAME,
    CREATE_GAME,
    FINISH_GAME,
    JOIN_GAME,
    START_GAME,
    VIEW_GAME,
    EDIT_GAME,
} from '@/shared/constants/constants';

@injectable()
@Controller('/game')
export default class GameController {

    constructor(
        @inject(VIEW_GAME_LIST) private readonly _viewGameList: ViewGameList,
        @inject(FINISH_GAME) private readonly _finishGame: FinishGame,
        @inject(CANCEL_GAME) private readonly _cancelGame: CancelGame,
        @inject(CREATE_GAME) private readonly _createGame: CreateGame,
        @inject(START_GAME) private readonly _startGame: StartGame,
        @inject(EDIT_GAME) private readonly _editGame: EditGame,
        @inject(VIEW_GAME) private readonly _viewGame: ViewGame,
        @inject(JOIN_GAME) private readonly _joinGame: JoinGame,
    ) {
    };

    @Get()
    async viewGameList() {
        const games = await this._viewGameList.execute();
        return {games};
    };

    @Get('/:id')
    async viewGame(@Params('id') gameId: string) {
        const game = await this._viewGame.execute(gameId);
        return {game};
    };

    @Post('/:id/start')
    async startGame(@Params('id') gameId: string) {
        const game = await this._startGame.execute(gameId);
        return {game};
    };

    @Post('/:id/finish')
    async finishGame(@Params('id') gameId: string) {
        const game = await this._finishGame.execute(gameId);
        return {game};
    };

    @Delete('/:id')
    async cancelGame(@Params('id') gameId: string) {
        const game = await this._cancelGame.execute(gameId);
        return {game};
    };

    @Put('/:id')
    async editGame(@Params('id') gameId: string, @Body() input: EditGameInputDto): Promise<EditGameOutputDto> {
        const useCaseInput = {
            ...input, id: gameId,
            startDate: input.startDate ? new Date(input.startDate): input.startDate,
        };
        const game = GameMapper.toDto(await this._editGame.execute(useCaseInput));
        return {game};
    };

    @Post()
    async createGame(@Body() input: CreateGameInputDto) {
        const game = this._createGame.execute({...input, startDate: new Date(input.startDate)});
        return {game};
    };

    @Post('/:id/join')
    async joinGame(@Params('id') gameId: string, @Body('playerId') playerId: string) {
        const game = await this._joinGame.execute(gameId, playerId);
        return {game};
    };

};
