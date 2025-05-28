import PlayerRepository from "@/domain/repositories/player-repository";

export default class VerifyPlayerName {

  constructor(private readonly playerRepository: PlayerRepository) {
  };

  async execute(playerName: string): Promise<boolean> {
    const player = await this.playerRepository.findByName(playerName);
    return !player;
  };

};