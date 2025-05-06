import FieldDetails from "@/domain/entities/field-details";

export default class Field {
  private readonly fieldDetails: FieldDetails;
  private readonly gamesList: string[];
  private _adminId: string;
  private _name: string;
  private readonly id: string;

  constructor({fieldDetails, gamesList, adminId, name, id}: Props) {
    this.fieldDetails = fieldDetails;
    this.gamesList = gamesList;
    this._adminId = adminId;
    this._name = name;
    this.id = id;
  };

  get name() {
    return this._name;
  };
  
  get adminId() {
    return this._adminId;
  }

  changeName(name: string) {
    if (this._name === name) throw new Error('NAMES_ARE_THE_SAME');
    this._name = name;
  };

  changeAdminId(adminId: string) {
    if (this._adminId === adminId) throw new Error('ADMIN_IDS_ARE_THE_SAME');
    this._adminId = adminId;
  };
  
};

interface Props {
  fieldDetails: FieldDetails;
  gamesList: string[];
  adminId: string;
  name: string,
  id: string,
}
