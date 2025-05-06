export default class User {
  private readonly password: string;
  private readonly fullName: string;
  private readonly birth: Date;
  private readonly photo: string;
  private readonly email: string;
  private readonly _name: string;
  private readonly id: string;

  constructor(props: Props) {
    this.password = props.password;
    this.fullName = props.fullName;
    this.birth = props.birth;
    this.photo = props.photo;
    this.email = props.email;
    this._name = props.name;
    this.id = props.id;
  };

  get name() {
    return this._name;
  };

};

interface Props {
  password: string;
  fullName: string;
  birth: Date;
  email: string;
  photo: string;
  name: string;
  id: string;
}
