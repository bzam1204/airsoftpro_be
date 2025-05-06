export default class Admin {
  private readonly fieldIds: string[];
  private readonly name: string;
  private readonly _id: string;

  constructor({id, name, fieldIds = []}: Props) {
    this.fieldIds = fieldIds;
    this.name = name;
    this._id = id;
  };

  get id() {
    return this._id;
  };

};

interface Props {
  fieldIds?: string[];
  name: string;
  id: string;
}
