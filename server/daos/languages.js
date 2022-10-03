import db from '@database/models';

export const insertLanguage = args => db.books.create(args);

export const updateLanguage = async ({ id, language }) => {
  const languageResponse = await db.languages.update({ language }, { where: { id }, returning: true });

  return languageResponse[1][0];
};
