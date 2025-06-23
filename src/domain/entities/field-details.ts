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

    get rules() {
        return this._rules;
    };

    changeInfrastructure(infrastructure: string) {
        this._infrastructure = infrastructure;
    };

    changeDescription(description: string) {
        this._description = description;
    };

    changeCoordinates(coordinates: string) {
        this._coordinates = coordinates;
    };

    changeAddress(address: string) {
        this._address = address;
    };

    changePhotos(photos: string[]) {
        this._photos = photos;
    };

    changeRules(rules: string) {
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
