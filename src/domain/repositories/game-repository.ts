import Game from "@/domain/entities/game";

export default interface GameRepository {
  findById(gameId: string): Promise<Game | null>;

  findAll(): Promise<Game[]>;

  create(game: Game): Promise<Game>;
  
  update(game: Game): Promise<Game>;
}