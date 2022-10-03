import db from '@database/models';

export const insertBook = args => db.books.create(args);

export const updateBook = async ({ id, name, genres, pages, publisherId }, { fetchUpdated }) => {
  const options = {};

  options.where = { id };

  if (fetchUpdated) {
    options.returning = true;
  }

  const bookRes = await db.books.update({ name, genres, pages, publisherId }, options);

  let affectedRowData;

  if (fetchUpdated) {
    // bookRes = returns an array with one or two elements. The first element is always the number of affected rows, while the second element is the actual affected rows(PostgresSQl only)
    const affectedRow = bookRes[1];

    // affectedRow = gets an array of all affected row elements(in our case we will always get a single element)
    affectedRowData = affectedRow[0];
  }

  return fetchUpdated ? affectedRowData : bookRes;
};
