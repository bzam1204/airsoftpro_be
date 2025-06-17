import GameStatus from "@/domain/enums/game-status";
import GameRules from "@/domain/entities/game-rules";

export default class Game {
    public static readonly errorCodes = {
        GAME_NOT_IN_SCHEDULED_STATUS: 'GAME_NOT_IN_SCHEDULED_STATUS',
        INVALID_STATUS_TO_CANCEL: 'INVALID_STATUS_TO_CANCEL',
        PLAYER_ALREADY_IN_GAME: 'PLAYER_ALREADY_IN_GAME',
        INSUFFICIENT_PLAYERS: 'INSUFFICIENT_PLAYERS',
        GAME_NOT_IN_PROGRESS: 'GAME_NOT_IN_PROGRESS',
        INVALID_START_DATE: 'INVALID_START_DATE',
        PLAYER_NOT_IN_GAME: 'PLAYER_NOT_IN_GAME',
        GAME_FULL: 'GAME_FULL',
    };
    private readonly _playerList: string[];
    private readonly _id: string;
    private _description?: string;
    private _finishDate?: Date;
    private _startDate: Date;
    private _gameRules: GameRules;
    private _gameMode: string;
    private _fieldId: string;
    private _status: GameStatus;

    constructor(
        {
            description = '',
            playerList = [],
            gameRules = new GameRules({}),
            startDate,
            gameMode,
            fieldId,
            status = GameStatus.SCHEDULED,
            id,
        }: Props) {
        if (!this.isValidStartDate(startDate)) throw new Error('INVALID_START_DATE');
        this._description = description;
        this._playerList = playerList;
        this._startDate = startDate;
        this._gameRules = gameRules;
        this._gameMode = gameMode;
        this._fieldId = fieldId;
        this._status = status;
        this._id = id;
    };

    get specificRules(): string | undefined {
        return this._gameRules.specificRules;
    };

    get gameMode() {
        return this._gameMode;
    };

    set gameMode(gameMode: string) {
        this._gameMode = gameMode;
    };

    set specificRules(specificRules: string) {
        this._gameRules.specificRules = specificRules;
    };

    get friendlyFire() {
        return this._gameRules.friendlyFire;
    };

    set friendlyFire(friendlyFire: boolean) {
        this._gameRules.friendlyFire = friendlyFire;
    };

    get minHonorLevel() {
        return this._gameRules.minHonorLevel;
    };

    set minHonorLevel(minHonorLevel: number) {
        this._gameRules.minHonorLevel = minHonorLevel;
    };

    get fieldId() {
        return this._fieldId;
    };

    set fieldId(id: string) {
        this._fieldId = id;
    };

    get finishDate() {
        return this._finishDate;
    };

    get startDate() {
        return this._startDate;
    };

    set startDate(date: Date) {
        if (!this.isGameScheduled()) throw new Error(Game.errorCodes.GAME_NOT_IN_SCHEDULED_STATUS);
        if (!this.isValidStartDate(date)) throw new Error(Game.errorCodes.INVALID_START_DATE);
        this._startDate = date;
    };

    get playersLimit() {
        return this._gameRules.playersLimit;
    };

    set playersLimit(playersLimit: number) {
        this._gameRules.playersLimit = playersLimit
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

    set fpsLimit(fpsLimit: number) {
        this._gameRules.fpsLimit = fpsLimit;
    };

    get description(): string | undefined {
        return this._description;
    };

    set description(description: string) {
        this._description = description;
    };

    start(): void {
        if (this._status !== GameStatus.SCHEDULED) throw new Error('GAME_NOT_IN_SCHEDULED_STATUS');
        if (this._playerList.length < 2) throw new Error('INSUFFICIENT_PLAYERS');
        this._status = GameStatus.STARTED;
        return void 0;
    };

    addPlayerParticipation(playerId: string): void {
        if (!this.isGameScheduled()) throw new Error(Game.errorCodes.GAME_NOT_IN_SCHEDULED_STATUS);
        if (this._playerList.includes(playerId)) throw new Error(Game.errorCodes.PLAYER_ALREADY_IN_GAME);
        if (this.isGameFull()) throw new Error(Game.errorCodes.GAME_FULL);
        this._playerList.push(playerId);
        return void 0;
    };


    removePlayer(playerId: string): void {
        if (!this._playerList.includes(playerId)) throw new Error(Game.errorCodes.PLAYER_NOT_IN_GAME);
        if (this._status !== GameStatus.SCHEDULED) throw new Error(Game.errorCodes.GAME_NOT_IN_SCHEDULED_STATUS);
        this._playerList.splice(this._playerList.indexOf(playerId), 1);
    };

    finish(): void {
        if (!this.isGameStarted()) throw new Error(Game.errorCodes.GAME_NOT_IN_PROGRESS);
        this._status = GameStatus.FINISHED;
        this._finishDate = new Date();
        return void 0;

    };

    cancel(): void {
        if (this.isGameScheduled() || this.isGameStarted()) {
            this._status = GameStatus.CANCELLED;
            return void 0;
        }
        throw new Error(Game.errorCodes.INVALID_STATUS_TO_CANCEL);
    };

    private isGameStarted(): boolean {
        return this._status === GameStatus.STARTED;
    };

    private isValidStartDate(date: Date): boolean {
        return date.getTime() > Date.now();
    };

    private isGameScheduled(): boolean {
        return this.status === GameStatus.SCHEDULED;
    };

    private isGameFull(): boolean {
        return this._playerList.length === this._gameRules.playersLimit;
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
