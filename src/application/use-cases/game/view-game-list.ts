import GameRepository from "@/domain/repositories/game-repository";
import Game from "@/domain/entities/game";

export default class ViewGameList {

  constructor(private readonly gameRepository: GameRepository) {
  }

  async execute(): Promise<Game[]> {
    return await this.gameRepository.findAll();
  }

}