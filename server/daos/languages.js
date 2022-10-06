import db from '@database/models';
import { daosUpdateUtils } from '@server/utils/daosUpdateUtils';

export const insertLanguage = args => db.languages.create(args);

export const updateLanguage = ({ id, language }, extras = {}) =>
  daosUpdateUtils(db.languages, id, { language }, extras.fetchUpdated);
