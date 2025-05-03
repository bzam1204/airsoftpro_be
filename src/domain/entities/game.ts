import GameRules from "@/domain/entities/game-rules";

export default class Game {
  private readonly description?: string;
  private readonly _playerList: string[];
  private readonly startDate: Date;
  private readonly gameRules: GameRules = new GameRules({});
  private readonly gameMode: string;
  private readonly fieldId: string;
  private readonly _id: string;
  private _status: GameStatus;

  constructor(
      {
        description = '',
        playerList = [],
        gameRules,
        startDate,
        gameMode,
        fieldId,
        status = GameStatus.SCHEDULED,
        id,
      }: Props) {
    if (this.isValidStartDate(startDate)) throw new Error('INVALID_START_DATE');
    this.description = description;
    this._playerList = playerList;
    this.startDate = startDate;
    this.gameMode = gameMode;
    this.fieldId = fieldId;
    this._status = status;
    this._id = id;
    if (playerList) this._playerList = playerList;
    if (gameRules) this.gameRules = gameRules;
  };

  private isValidStartDate(date: Date) {
    return date < new Date();
  }

  get status(): GameStatus {
    return this._status;
  };

  get id(): string {
    return this._id;
  };

  get playerList(): string[] {
    return this._playerList;
  };

  start(): void {
    if (this._status !== GameStatus.SCHEDULED) throw new Error('GAME_NOT_IN_SCHEDULED_STATUS');
    if (this._playerList.length < 2) throw new Error('INSUFFICIENT_PLAYERS');
    this._status = GameStatus.IN_PROGRESS;
    return void 0;
  };

  addPlayer(playerId: string): void {
    if (this._status !== GameStatus.SCHEDULED) throw new Error('GAME_NOT_IN_SCHEDULED_STATUS')
    if (this._playerList.includes(playerId)) throw new Error('PLAYER_ALREADY_IN_GAME');
    if (this._playerList.length === this.gameRules.playersLimit) throw new Error('GAME_FULL');
    this._playerList.push(playerId);
    return void 0;
  };

  removePlayer(playerId: string): void {
    if (!this._playerList.includes(playerId)) throw new Error('PLAYER_NOT_IN_GAME');
    if (this._status !== GameStatus.SCHEDULED) throw new Error('GAME_NOT_IN_SCHEDULED_STATUS');
    this._playerList.splice(this._playerList.indexOf(playerId), 1);
  };

  finish(): void {
    if (this._status === GameStatus.IN_PROGRESS) {
      this._status = GameStatus.COMPLETED;
      return void 0;
    }
    throw new Error('GAME_NOT_IN_PROGRESS');
  };

  cancel(): void {
    if (this._status === GameStatus.SCHEDULED || this._status === GameStatus.IN_PROGRESS) {
      this._status = GameStatus.CANCELLED;
      return void 0;
    }
    throw new Error('INVALID_STATUS_TO_CANCEL');
  };

};

interface Props {
  description?: string;
  playerList?: string[];
  gameRules?: GameRules;
  startDate: Date;
  gameMode: string;
  fieldId: string;
  status?: GameStatus;
  id: string;
};

export enum GameStatus {
  SCHEDULED = "SCHEDULED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
};