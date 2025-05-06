import FieldDetails from "@/domain/entities/field-details";

export default class Field {
  private readonly fieldDetails: FieldDetails;
  private readonly gamesList: string[];
  private _adminId: string;
  private _name: string;
  private readonly _id: string;

  constructor({fieldDetails, gamesList = [], adminId, name, id}: Props) {
    this.fieldDetails = fieldDetails;
    this.gamesList = gamesList;
    this._adminId = adminId;
    this._name = name;
    this._id = id;
  };

  get adminId() {
    return this._adminId;
  };

  get name() {
    return this._name;
  };

  get id() {
    return this._id;
  };

  changeName(name: string) {
    if (this._name === name) throw new Error('NAMES_ARE_THE_SAME');
    this._name = name;
  };

  changeAdminId(adminId: string) {
    if (this._adminId === adminId) throw new Error('ADMIN_IDS_ARE_THE_SAME');
    this._adminId = adminId;
  };

  editInfo(input: {
    infrastructure?: string;
    description?: string;
    coordinates?: string;
    address?: string;
    photos?: string[];
    rules?: string;
    name?: string;
  }) {
    if (input.infrastructure) this.fieldDetails.changeInfrastructure(input.infrastructure);
    if (input.description) this.fieldDetails.changeDescription(input.description);
    if (input.coordinates) this.fieldDetails.changeCoordinates(input.coordinates);
    if (input.address) this.fieldDetails.changeAddress(input.address);
    if (input.photos) this.fieldDetails.changePhotos(input.photos);
    if (input.rules) this.fieldDetails.changeRules(input.rules);
    if (input.name) this._name = input.name;
  };

};

interface Props {
  fieldDetails: FieldDetails;
  gamesList?: string[];
  adminId: string;
  name: string,
  id: string,
}
