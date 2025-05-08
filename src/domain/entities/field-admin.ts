export default class FieldAdmin {
  private readonly _id: string;
  private readonly _userId: string;

  constructor(props: Props) {
    this._userId = props.userId;
    this._id = props.id;
  };

  get userId() {
    return this._userId;
  };

};

interface Props {
  userId: string;
  id: string;
}
