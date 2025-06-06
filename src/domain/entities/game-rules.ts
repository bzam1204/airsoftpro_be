export default class GameRules {
  private _specificRules?: string;
  private _minHonorLevel: number;
  private _playersLimit: number;
  private _friendlyFire: boolean;
  private _fpsLimit: number;

  constructor({specificRules = '', minHonorLevel = 0, playersLimit = 10, friendlyFire = true, fpsLimit = 400}: Props) {
    if (!this.isValidPlayerLimit(playersLimit)) throw new Error('INVALID_PLAYER_LIMIT');
    if (!this.isValidHonorLevel(minHonorLevel)) throw new Error('INVALID_HONOR_LEVEL');
    if (!this.isValidFpsLimit(fpsLimit)) throw new Error('INVALID_FPS_LIMIT');
    this._specificRules = specificRules;
    this._minHonorLevel = minHonorLevel;
    this._friendlyFire = friendlyFire;
    this._playersLimit = playersLimit;
    this._fpsLimit = fpsLimit;
  };

  get specificRules(): string | undefined {
    return this._specificRules;
  };

  set specificRules(specificRules) {
    this._specificRules = specificRules;
  };

  get minHonorLevel(): number {
    return this._minHonorLevel;
  };

  set minHonorLevel(minHonorLevel: number) {
    if (!this.isValidHonorLevel(minHonorLevel)) throw new Error('INVALID_HONOR_LEVEL');
    this._minHonorLevel = minHonorLevel;
  };

  private isValidHonorLevel(minHonorLevel: number) {
    return minHonorLevel >= 0 && minHonorLevel <= 6;
  };

  get friendlyFire(): boolean {
    return this._friendlyFire;
  };

  set friendlyFire(friendlyFire: boolean) {
    this._friendlyFire = friendlyFire;
  };

  get fpsLimit(): number {
    return this._fpsLimit;
  };

  set fpsLimit(fpsLimit: number) {
    if (!this.isValidFpsLimit(fpsLimit)) throw new Error('INVALID_FPS_LIMIT');
    this._fpsLimit = fpsLimit;
  };

  get playersLimit() {
    return this._playersLimit;
  };

  set playersLimit(playersLimit: number) {
    if (!this.isValidPlayerLimit(playersLimit)) throw new Error('INVALID_PLAYER_LIMIT');
    this._playersLimit = playersLimit;
  };

  private isValidPlayerLimit(playersLimit: number) {
    return playersLimit >= 2;
  };

  private isValidFpsLimit(fpsLimit: number) {
    return fpsLimit >= 200;
  };

};

interface Props {
  specificRules?: string;
  minHonorLevel?: number;
  friendlyFire?: boolean;
  playersLimit?: number;
  fpsLimit?: number;
}
