import {inject, injectable} from 'tsyringe';

import GameRepository from '@/domain/repositories/game-repository';
import PlayerRepository from '@/domain/repositories/player-repository';
import Game from '@/domain/entities/game';

import {GAME_REPOSITORY, PLAYER_REPOSITORY} from '@/shared/constants/constants';

@injectable()
export default class JoinGame {

    constructor(
        @inject(GAME_REPOSITORY) private readonly gameRepository: GameRepository,
        @inject(PLAYER_REPOSITORY) private readonly playerRepository: PlayerRepository,
    ) {
    }

    async execute(gameId: string, playerId: string): Promise<Game> {
        const game = await this.gameRepository.findById(gameId);
        if (!game) throw new Error('GAME_NOT_FOUND');
        const player = await this.playerRepository.findById(playerId);
        if (!player) throw new Error('PLAYER_NOT_FOUND');
        game.addPlayerParticipation(playerId);
        return await this.gameRepository.update(game);
    }
}
