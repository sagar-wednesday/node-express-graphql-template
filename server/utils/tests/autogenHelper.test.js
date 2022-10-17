describe('autogenHelper tests', () => {
  it('should throw error if the getMOdelFiles is other than a string', () => {
    function mockPath() {
      const original = jest.requireActual('path');
      return {
        ...original,
        join: (...args) => {
          //   console.log(args);
          if (args[1] === '../gql/models/') {
            return 5;
          } else {
            return original.join(...args);
          }
        }
      };
    }

    jest.doMock('path', () => mockPath());
    const { getGqlModels } = require('../autogenHelper.js');

    expect(() => getGqlModels({})).toThrowError('modelPathString is invalid');
  });
});
