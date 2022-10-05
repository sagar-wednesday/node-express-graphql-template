export const daosUpdateUtils = async (table, id, fieldsToUpdate, fetchUpdated) => {
  const options = {};

  options.where = { id };

  if (fetchUpdated) {
    options.returning = true;
  }

  const res = await table.update({ ...fieldsToUpdate }, options);

  if (!fetchUpdated) {
    return res;
  }

  // res = returns an array with one or two elements. The first element is always the number of affected rows, while the second element is the actual affected rows(PostgresSQl only)
  const affectedRow = res[1];

  // affectedRow = gets an array of all affected row elements(in our case we will always get a single element)
  const affectedRowData = affectedRow[0];

  return affectedRowData;
};
