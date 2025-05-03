export default class Field {
  private readonly infrastructure: string;
  private readonly description: string;
  private readonly coordinates?: string;
  private readonly gamesList: string[];
  private readonly address: string;
  private readonly adminId: string;
  private readonly photos: string[];
  private readonly rules: string;
  private readonly name: string;
  private readonly id: string;

  constructor({coordinates = '', ...props}: Props) {
    this.infrastructure = props.infrastructure;
    this.description = props.description;
    this.coordinates = coordinates;
    this.gamesList = props.gamesList;
    this.address = props.address;
    this.adminId = props.adminId;
    this.photos = props.photos;
    this.rules = props.rules;
    this.name = props.name;
    this.id = props.id;
  } 

}

interface Props {
  infrastructure: string;
  description: string;
  coordinates?: string;
  gamesList: string[];
  address: string,
  adminId: string;
  photos: string[];
  rules: string;
  name: string,
  id: string,
}