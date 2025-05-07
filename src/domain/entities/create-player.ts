import IdGenerator from "@/application/services/id-generator";

import PlayerRepository from "@/domain/repositories/player-repository";
import UserRepository from "@/domain/repositories/user-repository";
import Player from "@/domain/entities/player";

export default class CreatePlayer {

  constructor(
      private readonly playerRepository: PlayerRepository,
      private readonly userRepository: UserRepository,
      private readonly idGenerator: IdGenerator,
  ) {
  }

  async execute(input: {userId: string; motto?: string; name: string;}): Promise<Player> {
    let prevPlayer = await this.playerRepository.findByName(input.name);
    if (prevPlayer) throw new Error('PLAYER_ALREADY_EXISTS');
    prevPlayer = await this.playerRepository.findByUserId(input.userId);
    if (prevPlayer) throw new Error('PLAYER_ALREADY_EXISTS');
    const user = await this.userRepository.findById(input.userId);
    if (!user) throw new Error('USER_NOT_FOUND');
    const id = this.idGenerator.generate()
    const player = new Player({...input, id});
    return await this.playerRepository.create(player);
  };

};
