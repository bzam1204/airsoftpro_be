import FieldDetails from "@/domain/entities/field-details";

describe('Detalhes do Campo', function () {

  it('Deve criar detalhes do campo', function () {
    const details = new FieldDetails({infrastructure : '', description : '', address : '', photos : [], rules : ''});
    expect(details).toBeInstanceOf(FieldDetails);
  });

  it('Deve alterar infrastructure', function () {
    const details = new FieldDetails({infrastructure : '', description : '', address : '', photos : [], rules : ''});
    const info = 'new_info';
    details.changeInfrastructure(info);
    expect(details.infrastructure).toBe(info);
  });

  it("Não deve alterar se for a mesma infra", function () {
    const details = new FieldDetails({infrastructure : '', description : '', address : '', photos : [], rules : ''});
    expect(() => details.changeInfrastructure(details.infrastructure)).toThrow('INFRAS_ARE_THE_SAME');
  });

  it('Deve alterar descrição', function () {
    const details = new FieldDetails({infrastructure : '', description : '', address : '', photos : [], rules : ''});
    const info = 'new_info';
    details.changeDescription(info);
    expect(details.description).toBe(info);
  });

  it("Não deve alterar se for a mesma descrição", function () {
    const details = new FieldDetails({infrastructure : '', description : '', address : '', photos : [], rules : ''});
    expect(() => details.changeDescription(details.description)).toThrow('DESCRIPTIONS_ARE_THE_SAME');
  });

  it('Deve alterar coordenadas', function () {
    const details = new FieldDetails({infrastructure : '', description : '', address : '', photos : [], rules : ''});
    const info = 'new_info';
    details.changeCoordinates(info);
    expect(details.coordinates).toBe(info);
  });

  it("Não deve alterar se forem as mesmas coordenadas", function () {
    const details = new FieldDetails({infrastructure : '', description : '', address : '', photos : [], rules : ''});
    expect(() => details.changeCoordinates(details.coordinates)).toThrow('COORDINATES_ARE_THE_SAME');
  });

  it('Deve alterar endereço', function () {
    const details = new FieldDetails({infrastructure : '', description : '', address : '', photos : [], rules : ''});
    const info = 'new_info';
    details.changeAddress(info);
    expect(details.address).toBe(info);
  });

  it("Não deve alterar se for o mesmo endereço ", function () {
    const details = new FieldDetails({infrastructure : '', description : '', address : '', photos : [], rules : ''});
    expect(() => details.changeAddress(details.address)).toThrow('ADDRESS_ARE_THE_SAME');
  });

  it('Deve alterar as regras', function () {
    const details = new FieldDetails({infrastructure : '', description : '', address : '', photos : [], rules : ''});
    const info = 'new_info';
    details.changeRules(info);
    expect(details.rules).toBe(info);
  });

  it("Não deve alterar se for as mesmas regras", function () {
    const details = new FieldDetails({infrastructure : '', description : '', address : '', photos : [], rules : ''});
    expect(() => details.changeRules(details.rules)).toThrow('RULES_ARE_THE_SAME');
  });

  it('Deve alterar o photos ', function () {
    const details = new FieldDetails({infrastructure : '', description : '', address : '', photos : [], rules : ''});
    const info = ['new_info'];
    details.changePhotos(info);
    expect(details.photos).toBe(info);
  });

  it("Não deve alterar se for a mesma photos", function () {
    const details = new FieldDetails({infrastructure : '', description : '', address : '', photos : [], rules : ''});
    expect(() => details.changePhotos(details.photos)).toThrow('PHOTOS_ARE_THE_SAME');
  });

});
