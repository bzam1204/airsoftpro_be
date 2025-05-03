export default class Player {
  private readonly honorLevel: number = 6;
  private readonly motto?: string;
  private readonly name: string;
  private readonly id: string;

  constructor(props: Props) {
    this.motto = props.motto;
    this.name = props.name;
    this.id = props.id;
  }

}

interface Props {
  motto?: string;
  name: string;
  id: string;
}