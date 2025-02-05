import db from '@database/models';
import { daosUpdateUtils } from '@server/utils/daosUpdateUtils';

export const insertAuthor = args => db.authors.create(args);

export const updateAuthor = ({ id, name, country, age }, extras = {}) =>
  daosUpdateUtils(db.authors, id, { name, country, age }, extras.fetchUpdated);
