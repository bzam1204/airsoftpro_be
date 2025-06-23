import IdGenerator from '@/application/services/id-generator';

import FieldRepository from '@/domain/repositories/field-repository';
import GameRepository from '@/domain/repositories/game-repository';
import GameRules from '@/domain/entities/game-rules';
import Game from '@/domain/entities/game';
import {inject, injectable} from 'tsyringe';
import {FIELD_REPOSITORY, GAME_REPOSITORY, ID_GENERATOR} from '@/shared/constants/constants';

@injectable()
export default class CreateGame {

    constructor(
        @inject(ID_GENERATOR) private readonly idGenerator: IdGenerator,
        @inject(GAME_REPOSITORY) private readonly gameRepository: GameRepository,
        @inject(FIELD_REPOSITORY) private readonly fieldRepository: FieldRepository,
    ) {
    };

    async execute(input: Input): Promise<Game> {
        const {fpsLimit, playersLimit, friendlyFire, minHonorLevel, specificRules, ...gameProps} = input;
        const field = await this.fieldRepository.findById(gameProps.fieldId);
        if (!field) throw new Error('FIELD_NOT_FOUND');
        const gameRules = new GameRules({fpsLimit, playersLimit, friendlyFire, minHonorLevel, specificRules});
        const game = new Game({...gameProps, id: this.idGenerator.generate(), gameRules});
        return this.gameRepository.create(game);
    };

};

interface Input {
    specificRules?: string,
    minHonorLevel: number,
    playersLimit: number,
    description?: string,
    friendlyFire: boolean,
    startDate: Date,
    fpsLimit?: number,
    gameMode: string,
    fieldId: string,
}
