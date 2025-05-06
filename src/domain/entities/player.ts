export default class Player {
  private _honorLevel: number;
  private _tolerance: number;
  private readonly motto?: string;
  private readonly name: string;
  private readonly _id: string;

  constructor({honorLevel = 6, tolerance = 10, motto = '', name, id}: Props) {
    if (honorLevel < 0) throw new Error('HONOR_CANNOT_BE_NEGATIVE');
    if (tolerance < 0) throw new Error('TOLERANCE_CANNOT_BE_NEGATIVE');
    this._honorLevel = honorLevel;
    this._tolerance = tolerance;
    this.motto = motto;
    this.name = name;
    this._id = id;
  };

  get honorLevel() {
    return this._honorLevel;
  };

  get tolerance() {
    return this._tolerance;
  };

  get id() {
    return this._id;
  };

  private removeHonor() {
    this._honorLevel -= 1;
  };

  removeTolerance() {
    this._tolerance -= 1;
    if (this._tolerance === 0) {
      this.removeHonor();
      this._tolerance = 10;
    }
  };

};

interface Props {
  honorLevel?: number;
  tolerance?: number;
  motto?: string;
  name: string;
  id: string;
}
