export default class GameRules {
  private readonly specificRules?: string;
  private readonly minHonorLevel: number;
  private readonly _playersLimit: number;
  private readonly friendlyFire: boolean;
  private readonly _fpsLimit: number;

  constructor({specificRules = '', minHonorLevel = 0, playersLimit = 10, friendlyFire = true, fpsLimit = 400}: Props) {
    if (playersLimit < 2) throw new Error('INVALID_PLAYER_LIMIT');
    if (fpsLimit < 200) throw new Error('INVALID_FPS_LIMIT');
    this.specificRules = specificRules;
    this.minHonorLevel = minHonorLevel;
    this.friendlyFire = friendlyFire;
    this._playersLimit = playersLimit;
    this._fpsLimit = fpsLimit;
  };

  get playersLimit() {
    return this._playersLimit;
  };

};

interface Props {
  specificRules?: string;
  minHonorLevel?: number;
  friendlyFire?: boolean;
  playersLimit?: number;
  fpsLimit?: number;
}
