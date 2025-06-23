import {inject, injectable} from 'tsyringe';

import PlayerRepository from '@/domain/repositories/player-repository';
import GameRepository from '@/domain/repositories/game-repository';
import Game from '@/domain/entities/game';

import {GAME_REPOSITORY, PLAYER_REPOSITORY} from '@/shared/constants/constants';

@injectable()
export default class CancelParticipation {

    constructor(
        @inject(GAME_REPOSITORY) private readonly gameRepository: GameRepository,
        @inject(PLAYER_REPOSITORY) private readonly playerRepository: PlayerRepository,
    ) {
    };

    async execute(gameId: string, playerId: string): Promise<Game> {
        const game = await this.gameRepository.findById(gameId);
        if (!game) throw new Error('GAME_NOT_FOUND');
        const player = await this.playerRepository.findById(playerId);
        if (!player) throw new Error('PLAYER_NOT_FOUND');
        game.removePlayer(playerId);
        return this.gameRepository.update(game);
    };

};
