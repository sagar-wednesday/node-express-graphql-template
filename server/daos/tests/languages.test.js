import db from '@database/models';
import { insertLanguage, updateLanguage } from '../languages';

describe('Books dao tests', () => {
  it('should create books', async () => {
    const language = 'English';

    const languageArgs = {
      language
    };

    const mock = jest.spyOn(db.languages, 'create');
    await insertLanguage(languageArgs);
    expect(mock).toHaveBeenCalledWith(languageArgs);
  });

  it('should update books', async () => {
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
