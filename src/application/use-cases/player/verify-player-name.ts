import {inject, injectable} from 'tsyringe';

import PlayerRepository from '@/domain/repositories/player-repository';

import {PLAYER_REPOSITORY} from '@/shared/constants/constants';

@injectable()
export default class VerifyPlayerName {

    constructor(@inject(PLAYER_REPOSITORY) private readonly playerRepository: PlayerRepository) {
    };

    async execute(playerName: string): Promise<boolean> {
        const player = await this.playerRepository.findByName(playerName);
        return !player;
    };

};
