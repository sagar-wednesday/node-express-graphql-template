import db from '@database/models';
import { insertLanguage, updateLanguage } from '../languages';

describe('Languages dao tests', () => {
  it('should create languages', async () => {
    const language = 'English';

    const languageArgs = {
      language
    };

    const mock = jest.spyOn(db.languages, 'create');
    await insertLanguage(languageArgs);
    expect(mock).toHaveBeenCalledWith(languageArgs);
  });

  it('should update languages', async () => {
    const id = 1;
    const language = 'English';

    const languageArgs = {
      id,
      language
    };

    const mock2 = jest.spyOn(db.languages, 'update');
    await updateLanguage(languageArgs, { fetchUpdated: true });

    const expectedArgs = { language };

    expect(mock2).toHaveBeenCalledWith(expectedArgs, { where: { id }, returning: true });
  });
});
