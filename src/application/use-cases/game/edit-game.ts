import GameRepository from "@/domain/repositories/game-repository";
import Game from "@/domain/entities/game";

export default class EditGame {

  constructor(private readonly gameRepository: GameRepository) {
  };

  async execute(input: Game) {
    const game = await this.gameRepository.findById(input.id);
    if (!game) throw new Error("GAME_NOT_FOUND");
    return await this.gameRepository.update(input);
  };

};