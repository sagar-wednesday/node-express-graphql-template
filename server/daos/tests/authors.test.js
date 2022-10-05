import db from '@database/models';
import { insertAuthor, updateAuthor } from '../authors';

describe('Authors dao tests', () => {
  const id = 1;
  const name = 'sagar';
  const country = 'India';
  const age = '24';
  let authorArgs;

  beforeEach(() => {
    authorArgs = {
      name,
      country,
      age
    };
  });

  describe('createAuthor', () => {
    it('should create authors', async () => {
      const createAuthorSpy = jest.spyOn(db.authors, 'create');
      const res = await insertAuthor(authorArgs);
      expect(createAuthorSpy).toHaveBeenCalledWith(authorArgs);
      expect(res?.dataValues).toMatchObject({
        ...authorArgs,
        id: `${id}`
      });
    });

    it('should throw an error if the database is down', async () => {
      const createAuthorSpy = jest.spyOn(db.authors, 'create');
      const errorMessage = 'database is down';
      createAuthorSpy.mockImplementation(() => {
        throw new Error(errorMessage);
      });
      expect(async () => insertAuthor(authorArgs)).rejects.toThrowError(errorMessage);
      expect(createAuthorSpy).toHaveBeenCalledWith(authorArgs);
    });
  });

  describe('updateAuthor', () => {
    let updateAuthorSpy;
    beforeEach(() => {
      updateAuthorSpy = jest.spyOn(db.authors, 'update');
    });
    it('should update authors when fetchUpdated = true', async () => {
      const updateAuthorSpy = jest.spyOn(db.authors, 'update');
      const res = await updateAuthor({ ...authorArgs, id }, { fetchUpdated: true });

      const expectedArgs = {
        age,
        country,
        name
      };

      expect(updateAuthorSpy).toHaveBeenCalledWith(expectedArgs, {
        where: { id },
        returning: true
      });

      expect(res?.dataValues).toMatchObject({ ...expectedArgs, id: `${id}` });
    });

    it('should update authors when fetchUpdated = false', async () => {
      updateAuthorSpy.mockImplementation(() => [1]);
      const res = await updateAuthor({ ...authorArgs, id });

      const expectedArgs = {
        age,
        country,
        name
      };

      expect(updateAuthorSpy).toHaveBeenCalledWith(expectedArgs, {
        where: { id }
      });
      expect(res).toEqual([1]);
    });
  });
});
