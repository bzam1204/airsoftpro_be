import GameRepository from "@/domain/repositories/game-repository";

export default class ViewGame {

  constructor(private readonly gameRepository: GameRepository) {
  }

  async execute(gameId: string) {
    const game = await this.gameRepository.findById(gameId);
    if (!game) throw new Error('GAME_NOT_FOUND');
    return game;
  }
}