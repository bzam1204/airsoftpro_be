import {inject, injectable} from "tsyringe";

import FieldRepository from "@/domain/repositories/field-repository";
import GameRepository from "@/domain/repositories/game-repository";
import GameStatus from "@/domain/enums/game-status";

import {FIELD_REPOSITORY, GAME_REPOSITORY} from "@/shared/constants/constants";

@injectable()
export default class EditGame {

  constructor(
      @inject(FIELD_REPOSITORY) private readonly fieldRepository: FieldRepository,
      @inject(GAME_REPOSITORY) private readonly gameRepository: GameRepository,
  ) {
  };

  async execute(input: Input) {
    const game = await this.gameRepository.findById(input.id);
    if (!game) throw new Error("GAME_NOT_FOUND");
    if (game.status === GameStatus.FINISHED) throw new Error('GAME_IN_FINISHED_STATUS');
    if (input.fieldId) {
      const field = await this.fieldRepository.findById(input.fieldId);
      if (!field) throw new Error('FIELD_NOT_FOUND');
      const gameField = await this.fieldRepository.findById(game.fieldId);
      if (!gameField) throw new Error('SOMETHING_WENT_WRONG');
      if (field.adminId !== gameField?.adminId) throw new Error('FIELD_NOT_OWNED_BY_GAME_ADMIN');
      game.fieldId = input.fieldId;
    }
    if (input.minHonorLevel) game.minHonorLevel = input.minHonorLevel;
    if (input.specificRules) game.specificRules = input.specificRules;
    if (input.playersLimit) game.playersLimit = input.playersLimit;
    if (input.friendlyFire) game.friendlyFire = input.friendlyFire;
    if (input.description) game.description = input.description;
    if (input.startDate) game.startDate = input.startDate;
    if (input.gameMode) game.gameMode = input.gameMode;
    if (input.fpsLimit) game.fpsLimit = input.fpsLimit;
    return await this.gameRepository.update(game);
  };

};

interface Input {
  specificRules?: string;
  minHonorLevel?: number;
  playersLimit?: number;
  friendlyFire?: boolean;
  description?: string;
  startDate?: Date;
  fpsLimit?: number;
  gameMode?: string;
  fieldId?: string;
  id: string;
}
