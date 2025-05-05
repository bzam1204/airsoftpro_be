export default class FieldDetails {
  private readonly infrastructure: string;
  private readonly description: string;
  private readonly coordinates?: string;
  private readonly address: string;
  private readonly photos: string[];
  private readonly rules: string;

  constructor({infrastructure, description, coordinates = '', address, photos, rules}: Props) {
    this.infrastructure = infrastructure;
    this.description = description;
    this.coordinates = coordinates;
    this.address = address;
    this.photos = photos;
    this.rules = rules;
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