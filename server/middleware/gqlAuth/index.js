import { flatMap } from 'lodash';
import { isLocalEnv, isTestEnv } from '@utils';
import { GQL_QUERY_TYPES } from './constants';

const { parse } = require('graphql');

export const invalidScope = (
  res,
  errors = [`Invalid scope to perform this operation. Contact support@wednesday.is for more information.`]
) =>
  res.status(401).send({
    errors
  });

export const getQueryNames = req => {
  const getQueryNamesFromSelectionSet = def =>
    def.selectionSet.selections.map(selection => ({
      operationType: def.operation,
      queryName: selection.name.value
    }));
  const operationName = req.body.operationName;
  const parsedQuery = parse(req.body.query);
  // find the correct defination based on the operation name
  const def = parsedQuery.definitions.find(definition => definition.name?.value === operationName);
  let queries = [];
  // def will only have a value if operationName is specifically provided. It is optional
  if (def) {
    queries = getQueryNamesFromSelectionSet(def);
  } else {
    // iterate over all definitions. Since multiple operations cannot be sent without an operation name
    // most likely parsedQuery.definitions will have length as 1.
    queries = flatMap(parsedQuery.definitions, getQueryNamesFromSelectionSet);
  }
  return queries.filter(({ operationType, queryName }) => !!operationType && !!queryName);
};

export const isPublicQuery = async req => {
  const queries = getQueryNames(req);
  return queries.every(({ queryName, operationType }) => GQL_QUERY_TYPES[operationType].whitelist.includes(queryName));
};

export const handlePreflightRequest = function(req, res, next) {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', '*');
    res.sendStatus(200);
  } else {
    next();
  }
};

export const corsOptionsDelegate = function(req, callback) {
  const allowedDomain = 'wednesday.is';
  let corsOptions;

  if (isLocalEnv() || isTestEnv()) {
    corsOptions = { origin: true };
  } else if (req?.header('Origin')?.includes(allowedDomain) || req?.header('Origin')?.includes('localhost')) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }

  callback(null, corsOptions); // callback expects two parameters: error and options
};
