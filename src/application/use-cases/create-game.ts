import GameRepository from "@/domain/repositories/game-repository";
import IdGenerator from "@/domain/services/id-generator";
import GameRules from "@/domain/entities/game-rules";
import Game from "@/domain/entities/game";

export default class CreateGame {

  constructor(
      private readonly idGenerator: IdGenerator,
      private readonly gameRepository: GameRepository,
      private readonly fieldRepository: FieldRepository,
  ) {
  };

  async execute({fpsLimit, playersLimit, friendlyFire, minHonorLevel, specificRules, ...gameProps}: Props) {
    const field = await this.fieldRepository.findById(gameProps.fieldId);
    if (!field) throw new Error("FIELD_NOT_FOUND");
    const gameRules = new GameRules({fpsLimit, playersLimit, friendlyFire, minHonorLevel, specificRules});
    const game = new Game({...gameProps, id : this.idGenerator.generate(), gameRules});
    return this.gameRepository.create(game);
  };

}

interface Props {
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
