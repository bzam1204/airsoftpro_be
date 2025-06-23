import {inject, injectable} from 'tsyringe';

import GameRepository from '@/domain/repositories/game-repository';
import Game from '@/domain/entities/game';

import {GAME_REPOSITORY} from '@/shared/constants/constants';

@injectable()
export default class CancelGame {

    constructor(
        @inject(GAME_REPOSITORY) private readonly gameRepository: GameRepository
    ) {
    }

    async execute(gameId: string): Promise<Game> {
        const game = await this.gameRepository.findById(gameId);
        if (!game) throw new Error('GAME_NOT_FOUND');
        game.cancel();
        return game;
    };

};
