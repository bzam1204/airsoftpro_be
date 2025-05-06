import GameRules from "@/domain/entities/game-rules";
import GameStatus from "@/domain/enums/game-status";

export default class Game {
  private readonly description?: string;
  private readonly _playerList: string[];
  private readonly _startDate: Date;
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
    this._startDate = startDate;
    this.gameMode = gameMode;
    this.fieldId = fieldId;
    this._status = status;
    this._id = id;
    if (playerList) this._playerList = playerList;
    if (gameRules) this.gameRules = gameRules;
  };

  get startDate() {
    return this._startDate;
  };

  get playerList() {
    return this._playerList;
  };

  get status() {
    return this._status;
  };

  get id() {
    return this._id;
  };

  start(): void {
    if (this._status !== GameStatus.SCHEDULED) throw new Error('GAME_NOT_IN_SCHEDULED_STATUS');
    if (this._playerList.length < 2) throw new Error('INSUFFICIENT_PLAYERS');
    this._status = GameStatus.STARTED;
    return void 0;
  };

  addPlayerParticipation(playerId: string): void {
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
    if (this._status === GameStatus.STARTED) {
      this._status = GameStatus.FINISHED;
      return void 0;
    }
    throw new Error('GAME_NOT_IN_PROGRESS');
  };

  cancel(): void {
    if (this._status === GameStatus.SCHEDULED || this._status === GameStatus.STARTED) {
      this._status = GameStatus.CANCELLED;
      return void 0;
    }
    throw new Error('INVALID_STATUS_TO_CANCEL');
  };

  private isValidStartDate(date: Date) {
    return date < new Date();
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
}

