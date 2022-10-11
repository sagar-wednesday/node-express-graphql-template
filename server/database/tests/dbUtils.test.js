import { deletedId, deleteUsingId, sequelizedWhere, updateUsingId } from '@database/dbUtils';
import { Op } from 'sequelize';

describe('updateUsingId', () => {
  let mocks;
  beforeEach(() => {
    mocks = {
      model: { name: 'mock', findOne: jest.fn(), update: jest.fn(() => [1]) }
    };
  });
  it('should invoke model.update, model.findOne with the correct args when it actually does update rows of the model', async () => {
    jest.spyOn(mocks.model, 'findOne');
    jest.spyOn(mocks.model, 'update');
    const args = { id: 1 };
    await updateUsingId(mocks.model, args);

    // check if update is being invoked with the correct args
    expect(mocks.model.update.mock.calls.length).toEqual(1);
    expect(mocks.model.update.mock.calls[0][0]).toEqual(args);
    expect(mocks.model.update.mock.calls[0][1]).toEqual({ where: { id: args.id, deletedAt: null } });

    // check if model.findOne is being invoked with the correct args
    expect(mocks.model.findOne.mock.calls.length).toEqual(1);
    expect(mocks.model.findOne.mock.calls[0][0]).toEqual({ where: { id: args.id } });
  });

  it('should throw an error if the affected rows are 0', async () => {
    mocks.model.update = jest.fn(() => [0]);
    jest.spyOn(mocks.model, 'findOne');
    jest.spyOn(mocks.model, 'update');
    const args = { id: 1 };
    await expect(updateUsingId(mocks.model, args)).rejects.toEqual(new Error(`Data not found`));

    // check if update is being invoked with the correct args
    expect(mocks.model.update.mock.calls.length).toEqual(1);
    expect(mocks.model.update.mock.calls[0][0]).toEqual(args);
    expect(mocks.model.update.mock.calls[0][1]).toEqual({ where: { id: args.id, deletedAt: null } });

    // findOne should not be called in this case
    expect(mocks.model.findOne.mock.calls.length).toEqual(0);
  });

  it('should throw an error there is an error while updating the model', async () => {
    mocks.model.update.mockImplementation(() => {
      throw new Error('failed');
    });
    jest.spyOn(mocks.model, 'findOne');
    jest.spyOn(mocks.model, 'update');
    const args = { id: 1 };
    await expect(updateUsingId(mocks.model, args)).rejects.toEqual(new Error(`Failed to update ${mocks.model.name}`));

    // check if update is being invoked with the correct args
    expect(mocks.model.update.mock.calls.length).toEqual(1);
    expect(mocks.model.update.mock.calls[0][0]).toEqual(args);
    expect(mocks.model.update.mock.calls[0][1]).toEqual({ where: { id: args.id, deletedAt: null } });

    // findOne should not be called in this case
    expect(mocks.model.findOne.mock.calls.length).toEqual(0);
  });
});

describe('deleteUsingId', () => {
  let mocks;
  beforeEach(() => {
    mocks = {
      model: { name: 'mock', destroy: jest.fn(() => [1]) }
    };
  });
  it('should invoke model.destroy, with the correct args when it actually does update rows of the model', async () => {
    jest.spyOn(mocks.model, 'destroy');
    const args = { id: 1 };
    expect(await deleteUsingId(mocks.model, args)).toBe(args);

    // check if delete is being invoked with the correct args
    expect(mocks.model.destroy.mock.calls.length).toEqual(1);
    expect(mocks.model.destroy.mock.calls[0][0]).toEqual({ where: { id: args.id, deletedAt: null } });
  });

  it('should throw an error if the affected rows are 0', async () => {
    mocks.model.destroy = jest.fn(() => 0);
    jest.spyOn(mocks.model, 'destroy');
    const args = { id: 1 };
    await expect(deleteUsingId(mocks.model, args)).rejects.toEqual(new Error(`Data not found`));

    // check if update is being invoked with the correct args
    expect(mocks.model.destroy.mock.calls.length).toEqual(1);
    expect(mocks.model.destroy.mock.calls[0][0]).toEqual({ where: { id: args.id, deletedAt: null } });
  });

  it('should throw an error there is an error while updating the model', async () => {
    mocks.model.destroy.mockImplementation(() => {
      throw new Error('failed');
    });
    jest.spyOn(mocks.model, 'destroy');
    const args = { id: 1 };
    await expect(deleteUsingId(mocks.model, args)).rejects.toEqual(new Error(`Failed to delete ${mocks.model.name}`));

    // check if update is being invoked with the correct args
    expect(mocks.model.destroy.mock.calls.length).toEqual(1);
    expect(mocks.model.destroy.mock.calls[0][0]).toEqual({ where: { id: args.id, deletedAt: null } });
  });
});

describe('deletedId', () => {
  it('returns deletedId GraphQLObject', () => {
    expect(deletedId.name).toEqual('Id');
  });
});

describe('sequelizedWhere', () => {
  it('if no args are given it will return empty object', () => {
    expect(sequelizedWhere()).toEqual({});
  });

  it('if where args is provided then return the deepMapKeys where args', async () => {
    const currentWhere = {};
    const input = {
      languages: 'hindi'
    };
    const where = { languages: input.languages };
    expect(sequelizedWhere(currentWhere, where)).toEqual(input);
  });

  it('if where args is provided then return the deepMapKeys where args is Op(sequelize) methods', async () => {
    const currentWhere = {};
    const operation = 'eq';
    const input = {
      [Op[operation]]: {
        languages: 'hindi'
      }
    };
    const where = { [operation]: { languages: 'hindi' } };
    expect(sequelizedWhere(currentWhere, where)).toEqual(input);
  });
});
