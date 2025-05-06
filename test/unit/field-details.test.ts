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

  it('Deve alterar descrição', function () {
    const details = new FieldDetails({infrastructure : '', description : '', address : '', photos : [], rules : ''});
    const info = 'new_info';
    details.changeDescription(info);
    expect(details.description).toBe(info);
  });

  it('Deve alterar coordenadas', function () {
    const details = new FieldDetails({infrastructure : '', description : '', address : '', photos : [], rules : ''});
    const info = 'new_info';
    details.changeCoordinates(info);
    expect(details.coordinates).toBe(info);
  });

  it('Deve alterar endereço', function () {
    const details = new FieldDetails({infrastructure : '', description : '', address : '', photos : [], rules : ''});
    const info = 'new_info';
    details.changeAddress(info);
    expect(details.address).toBe(info);
  });

  it('Deve alterar as regras', function () {
    const details = new FieldDetails({infrastructure : '', description : '', address : '', photos : [], rules : ''});
    const info = 'new_info';
    details.changeRules(info);
    expect(details.rules).toBe(info);
  });

  it('Deve alterar o photos ', function () {
    const details = new FieldDetails({infrastructure : '', description : '', address : '', photos : [], rules : ''});
    const info = ['new_info'];
    details.changePhotos(info);
    expect(details.photos).toBe(info);
  });

});
