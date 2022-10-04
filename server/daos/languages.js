import db from '@database/models';
import { daosUpdateUtils } from '@server/utils/daosUpdateUtils';

export const insertLanguage = args => db.books.create(args);

export const updateLanguage = ({ id, language }, { fetchUpdated }) => {
  daosUpdateUtils(db.languages, id, { language }, fetchUpdated);
};
