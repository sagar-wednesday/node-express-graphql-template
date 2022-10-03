import db from '@database/models';

export const insertAuthor = args => db.authors.create(args);

export const updateAuthor = async ({ id, name, country, age }, { fetchUpdated }) => {
  const options = {};

  options.where = { id };

  if (fetchUpdated) {
    options.returning = true;
  }

  const authorRes = await db.authors.update({ name, country, age }, options);

  let affectedRowData;

  if (fetchUpdated) {
    // authorRes = returns an array with one or two elements. The first element is always the number of affected rows, while the second element is the actual affected rows(PostgresSQl only)
    const affectedRow = authorRes[1];

    // affectedRow = gets an array of all affected row elements(in our case we will always get a single element)
    affectedRowData = affectedRow[0];
  }

  return fetchUpdated ? affectedRowData : authorRes;
};
