import {inject, injectable} from "tsyringe";

import GameRepository from "@/domain/repositories/game-repository";
import Game from "@/domain/entities/game";

import {GAME_REPOSITORY} from "@/shared/constants/constants";

@injectable()
export default class ViewGameList {

  constructor(@inject(GAME_REPOSITORY) private readonly gameRepository: GameRepository) {
  }

  async execute(): Promise<Game[]> {
    return await this.gameRepository.findAll();
  };

};
