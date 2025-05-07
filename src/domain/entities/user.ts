export default class User {
  private readonly _password: string;
  private readonly fullName: string;
  private readonly birth: Date;
  private readonly photo: string;
  private readonly email: string;
  private readonly _name: string;
  private readonly _id: string;

  constructor(props: Props) {
    if (!this.isValidBirth(props.birth)) throw new Error('INVALID_BIRTH');
    this._password = props.password;
    this.fullName = props.fullName;
    this.birth = props.birth;
    this.photo = props.photo;
    this.email = props.email;
    this._name = props.name;
    this._id = props.id;
  };

  get password() {
    return this._password;
  };

  get name() {
    return this._name;
  };
  
  get id() {
    return this._id;
  };
  
  private isValidBirth(birth: Date, now: Date = new Date()) {
    return birth.getTime() < now.getTime();
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
