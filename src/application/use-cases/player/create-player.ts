import PlayerRepository from '@/domain/repositories/player-repository';
import UserRepository from '@/domain/repositories/user-repository';
import IdGenerator from '@/application/services/id-generator';
import Player from '@/domain/entities/player';
import {inject, injectable} from 'tsyringe';
import {ID_GENERATOR, PLAYER_REPOSITORY, USER_REPOSITORY} from '@/shared/constants/constants';

@injectable()
export default class CreatePlayer {

    constructor(
        @inject(PLAYER_REPOSITORY) private readonly playerRepository: PlayerRepository,
        @inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
        @inject(ID_GENERATOR) private readonly idGenerator: IdGenerator,
    ) {
    }

    async execute(input: {userId: string; motto?: string; name: string;}): Promise<Player> {
        let prevPlayer = await this.playerRepository.findByName(input.name);
        if (prevPlayer) throw new Error('PLAYER_ALREADY_EXISTS');
        prevPlayer = await this.playerRepository.findByUserId(input.userId);
        if (prevPlayer) throw new Error('PLAYER_ALREADY_EXISTS');
        const user = await this.userRepository.findById(input.userId);
        if (!user) throw new Error('USER_NOT_FOUND');
        const id = this.idGenerator.generate();
        const player = new Player({...input, id});
        return await this.playerRepository.create(player);
    };

};