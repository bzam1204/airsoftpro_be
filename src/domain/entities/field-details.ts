export default class FieldDetails {
  private _infrastructure: string;
  private _description: string;
  private _coordinates: string = '';
  private _address: string;
  private _photos: string[];
  private _rules: string;

  constructor({infrastructure, description, coordinates = '', address, photos, rules}: Props) {
    this._infrastructure = infrastructure;
    this._description = description;
    this._coordinates = coordinates;
    this._address = address;
    this._photos = photos;
    this._rules = rules;
  };

  get infrastructure() {
    return this._infrastructure;
  };

  get description() {
    return this._description;
  };

  get coordinates() {
    return this._coordinates;
  };

  get address() {
    return this._address;
  };

  get photos() {
    return this._photos;
  };
  
  get rules () {
    return this._rules;
  };

  changeInfrastructure(infrastructure: string) {
    if (this._infrastructure === infrastructure) throw new Error('INFRAS_ARE_THE_SAME');
    this._infrastructure = infrastructure;
  };

  changeDescription(description: string) {
    if (this._description === description) throw new Error('DESCRIPTIONS_ARE_THE_SAME');
    this._description = description;
  };

  changeCoordinates(coordinates: string) {
    if (this._coordinates === coordinates) throw new Error('COORDINATES_ARE_THE_SAME');
    this._coordinates = coordinates;
  };

  changeAddress(address: string) {
    if (this._address === address) throw new Error('ADDRESS_ARE_THE_SAME');
    this._address = address;
  };

  changePhotos(photos: string[]) {
    if (this._photos === photos) throw new Error('PHOTOS_ARE_THE_SAME');
    this._photos = photos;
  };

  changeRules(rules: string) {
    if (this._rules === rules) throw new Error('RULES_ARE_THE_SAME');
    this._rules = rules;
  };

};

interface Props {
  infrastructure: string;
  description: string;
  coordinates?: string;
  address: string,
  photos: string[];
  rules: string;
}
