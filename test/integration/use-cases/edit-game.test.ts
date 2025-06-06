import EditGame from "@/application/use-cases/game/edit-game";

import GameStatus from "@/domain/enums/game-status";
import Field from "@/domain/entities/field";
import Game from "@/domain/entities/game";

import FieldRepositoryMemory from "@/infrastructure/repositories/field-repository-memory";
import GameRepositoryMemory from "@/infrastructure/repositories/game-repository-memory";

import fieldProps from "@test/shared/field-props";
import gameProps from "@test/shared/game-props";

describe("Editar Partida", function () {

  it('Não Deve editar as informações de uma partida inexistente', async function () {
    const gameRepository = new GameRepositoryMemory([new Game(gameProps)]);
    const editGame = new EditGame(new FieldRepositoryMemory(), gameRepository);
    const props = {id : 'invalid'};
    await expect(editGame.execute(props)).rejects.toThrow('GAME_NOT_FOUND');
  });

  it('Não deve editar as informações de uma partida finalizada', async function () {
    const gameRepository = new GameRepositoryMemory([new Game({...gameProps, status : GameStatus.FINISHED})]);
    const editGame = new EditGame(new FieldRepositoryMemory(), gameRepository);
    const props = {id : '1'};
    await expect(editGame.execute(props)).rejects.toThrow('GAME_IN_FINISHED_STATUS');
  });

  it('Não deve reagendar a data de início para antes da data de agora', async function () {
    const gameRepository = new GameRepositoryMemory([new Game(gameProps)]);
    const editGame = new EditGame(new FieldRepositoryMemory(), gameRepository);
    const props = {id : '1', startDate : new Date(Date.now() - 1000 * 60 * 60 * 2)};
    await expect(editGame.execute(props)).rejects.toThrow('INVALID_START_DATE');
  });

  it('Não deve trocar para um campo que não exista', async function () {
    const gameRepository = new GameRepositoryMemory([new Game(gameProps)]);
    const editGame = new EditGame(new FieldRepositoryMemory(), gameRepository);
    const props = {id : '1', fieldId : 'invalid'};
    await expect(editGame.execute(props)).rejects.toThrow('FIELD_NOT_FOUND');
  });

  it('Não deve trocar para um campo que não pertença ao mesmo dono', async function () {
    const gameRepository = new GameRepositoryMemory([new Game(gameProps)]);
    let fieldRepository = new FieldRepositoryMemory([new Field(fieldProps), new Field({
      ...fieldProps,
      id : '2',
      adminId : '2'
    })]);
    const editGame = new EditGame(fieldRepository, gameRepository);
    const props = {id : '1', fieldId : '2'};
    await expect(editGame.execute(props)).rejects.toThrow('FIELD_NOT_OWNED_BY_GAME_ADMIN');
  });

  it('Não deve trocar para um fps menor que 200', async function () {
    const gameRepository = new GameRepositoryMemory([new Game(gameProps)]);
    const editGame = new EditGame(new FieldRepositoryMemory(), gameRepository);
    const props = {id : '1', fpsLimit : 199};
    await expect(editGame.execute(props)).rejects.toThrow('INVALID_FPS_LIMIT');
  });

  it('Não deve trocar para um limite de jogadores menor que 2', async function () {
    const gameRepository = new GameRepositoryMemory([new Game(gameProps)]);
    const editGame = new EditGame(new FieldRepositoryMemory(), gameRepository);
    const props = {id : '1', playersLimit : 1};
    await expect(editGame.execute(props)).rejects.toThrow('INVALID_PLAYER_LIMIT');
  });

  it('Deve editar a descrição', async function () {
    const gameRepository = new GameRepositoryMemory([new Game(gameProps)]);
    const editGame = new EditGame(new FieldRepositoryMemory(), gameRepository);
    const props = {id : '1', description : 'new description'};
    const game = await editGame.execute(props);
    expect(game.description).toBe(props.description);
  });

  it('Deve editar o nível mínimo de honra', async function () {
    const gameRepository = new GameRepositoryMemory([new Game(gameProps)]);
    const editGame = new EditGame(new FieldRepositoryMemory(), gameRepository);
    const props = {id : '1', minHonorLevel : 1};
    const game = await editGame.execute(props);
    expect(game.minHonorLevel).toBe(props.minHonorLevel);
  });

  it('Não deve trocar para um nível mínimo de honra menor que 0', async function () {
    const gameRepository = new GameRepositoryMemory([new Game(gameProps)]);
    const editGame = new EditGame(new FieldRepositoryMemory(), gameRepository);
    const props = {id : '1', minHonorLevel : -1};
    await expect(editGame.execute(props)).rejects.toThrow('INVALID_HONOR_LEVEL');
  });

  it('Não deve trocar para um nível mínimo de honra maior que 7', async function () {
    const gameRepository = new GameRepositoryMemory([new Game(gameProps)]);
    const editGame = new EditGame(new FieldRepositoryMemory(), gameRepository);
    const props = {id : '1', minHonorLevel : 7};
    await expect(editGame.execute(props)).rejects.toThrow('INVALID_HONOR_LEVEL');
  });

  it('Deve editar as regras específicas', async function () {
    const gameRepository = new GameRepositoryMemory([new Game(gameProps)]);
    const editGame = new EditGame(new FieldRepositoryMemory(), gameRepository);
    const props = {id : '1', specificRules : 'new specific rules'};
    const game = await editGame.execute(props);
    expect(game.specificRules).toBe(props.specificRules);
  });

  it('Deve editar o fogo amigo', async function () {
    const gameRepository = new GameRepositoryMemory([new Game(gameProps)]);
    const editGame = new EditGame(new FieldRepositoryMemory(), gameRepository);
    const props = {id : '1', friendlyFire : true};
    const game = await editGame.execute(props);
    expect(game.friendlyFire).toBe(props.friendlyFire);
  });

  it('Deve editar o modo de jogo', async function () {
    const gameRepository = new GameRepositoryMemory([new Game(gameProps)]);
    const editGame = new EditGame(new FieldRepositoryMemory(), gameRepository);
    const props = {id : '1', gameMode : 'Deathmatch'};
    const game = await editGame.execute(props);
    expect(game.gameMode).toBe(props.gameMode);
  });

  it('Deve alterar o campo em que acontecerá a partida', async function () {
    const gameRepository = new GameRepositoryMemory([new Game(gameProps)]);
    const editGame = new EditGame(new FieldRepositoryMemory(), gameRepository);
    const props = {id : '1', fieldId : '2'};
    const game = await editGame.execute(props);
    expect(game.fieldId).toBe(props.fieldId);
  });
  
  it('Deve alterar o data de início', async function () {
    const gameRepository = new GameRepositoryMemory([new Game(gameProps)]);
    const editGame = new EditGame(new FieldRepositoryMemory(), gameRepository);
    const props = {id : '1', startDate : new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)};
    const game = await editGame.execute(props);
    expect(game.startDate).toBe(props.startDate);
  });

});
