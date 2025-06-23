import {inject, injectable} from 'tsyringe';

import GameRepository from '@/domain/repositories/game-repository';

import {GAME_REPOSITORY} from '@/shared/constants/constants';

@injectable()
export default class ViewGame {

    constructor(@inject(GAME_REPOSITORY) private readonly gameRepository: GameRepository) {
    }

    async execute(gameId: string) {
        const game = await this.gameRepository.findById(gameId);
        if (!game) throw new Error('GAME_NOT_FOUND');
        return game;
    };

};
