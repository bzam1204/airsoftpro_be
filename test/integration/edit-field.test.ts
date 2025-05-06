import EditField from "@/application/use-cases/edit-field";

import Field from "@/domain/entities/field";

import FieldRepositoryMemory from "@/infrastructure/repositories/field-repository-memory";

import fieldProps from "@test/shared/field-props";

describe('Editar Campo', function () {

  it('Deve editar as informações de um campo', async function () {
    const prevField = new Field(fieldProps);
    const fieldRepository = new FieldRepositoryMemory([prevField]);
    const editField = new EditField(fieldRepository);
    const field = await editField.execute({
      infrastructure : 'new',
      coordinates : 'new',
      description : 'new',
      address : 'new',
      photos : ['new', 'new'],
      rules : 'new',
      name : 'new',
      id : fieldProps.id
    });
    expect(field).toBeInstanceOf(Field);
    expect(field.name).toBe('new');
  });

});
