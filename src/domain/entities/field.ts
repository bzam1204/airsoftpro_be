import FieldDetails from "@/domain/entities/field-details";

export default class Field {
  private readonly fieldDetails: FieldDetails;
  private readonly gamesList: string[];
  private readonly adminId: string;
  private readonly name: string;
  private readonly id: string;

  constructor({fieldDetails, gamesList, adminId, name, id}: Props) {
    this.fieldDetails = fieldDetails;
    this.gamesList = gamesList;
    this.adminId = adminId;
    this.name = name;
    this.id = id;
  };

};

interface Props {
  fieldDetails: FieldDetails;
  gamesList: string[];
  adminId: string;
  name: string,
  id: string,
}