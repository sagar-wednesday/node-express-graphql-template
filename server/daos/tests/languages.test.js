import db from '@database/models';
import { insertLanguage, updateLanguage } from '../languages';

describe('Languages dao tests', () => {
  const id = 1;
  const language = 'English';
  let languageArgs;

  beforeEach(() => {
    languageArgs = {
      language
    };
  });

  describe('createLanguage', () => {
    it('should create languages', async () => {
      const createLanguageSpy = jest.spyOn(db.languages, 'create');
      const res = await insertLanguage(languageArgs);
      expect(createLanguageSpy).toHaveBeenCalledWith(languageArgs);
      expect(res?.dataValues).toMatchObject({
        ...languageArgs,
        id: `${id}`
      });
    });

    it('should throw an error if the database is down', async () => {
      const createLanguageSpy = jest.spyOn(db.languages, 'create');
      const errorMessage = 'database is down';
      createLanguageSpy.mockImplementation(() => {
        throw new Error(errorMessage);
      });
      expect(async () => insertLanguage(languageArgs)).rejects.toThrowError(errorMessage);
      expect(createLanguageSpy).toHaveBeenCalledWith(languageArgs);
    });
  });

  describe('updateLanguage', () => {
    let updateLanguageSpy;
    let expectedArgs;
    beforeEach(() => {
      updateLanguageSpy = jest.spyOn(db.languages, 'update');
      expectedArgs = {
        language
      };
    });

    it('should update languages when fetchUpdated = true', async () => {
      const res = await updateLanguage({ ...languageArgs, id }, { fetchUpdated: true });

      expect(updateLanguageSpy).toHaveBeenCalledWith(expectedArgs, {
        where: { id },
        returning: true
      });

      expect(res?.dataValues).toMatchObject({ ...expectedArgs, id: `${id}` });
    });

    it('should update languages when fetchUpdated = false', async () => {
      updateLanguageSpy.mockImplementation(() => [1]);
      const res = await updateLanguage({ ...languageArgs, id });

      expect(updateLanguageSpy).toHaveBeenCalledWith(expectedArgs, {
        where: { id }
      });
      expect(res).toEqual([1]);
    });
  });
});
