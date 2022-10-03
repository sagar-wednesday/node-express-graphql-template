import db from '@database/models';

export const insertLanguage = args => db.books.create(args);

export const updateLanguage = async ({ id, language }, { fetchUpdated }) => {
  const options = {};

  options.where = { id };

  if (fetchUpdated) {
    options.returning = true;
  }

  const languageRes = await db.languages.update({ language }, { where: { id }, returning: true });

  let affectedRowData;

  if (fetchUpdated) {
    // languageRes = returns an array with one or two elements. The first element is always the number of affected rows, while the second element is the actual affected rows(PostgresSQl only)
    const affectedRow = languageRes[1];

    // affectedRow = gets an array of all affected row elements(in our case we will always get a single element)
    affectedRowData = affectedRow[0];
  }

  return fetchUpdated ? affectedRowData : languageRes;
};
