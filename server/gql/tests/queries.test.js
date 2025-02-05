import get from 'lodash/get';
import includes from 'lodash/includes';
import pluralize from 'pluralize';
import { graphql, GraphQLSchema } from 'graphql';

import { QueryRoot } from '../queries';
import { MutationRoot } from '../mutations';
import { logger } from '@server/utils';

const schema = new GraphQLSchema({ query: QueryRoot, mutation: MutationRoot });
const allModels = ['author', 'authorsBook', 'book', 'booksLanguage', 'language', 'publisher'];

allModels.forEach(model => allModels.push(pluralize(model)));

describe('query tests', () => {
  it('should create queries for all the models', async () => {
    const source = `
    query {
      __schema {
        queryType {
          fields {
            name
          }
        }
      }
    }
`;
    logger().info('all models', allModels);

    const result = await graphql({ schema, source });
    const queryRoot = get(result, 'data.__schema.queryType.fields', []);
    const allQueries = [];
    queryRoot.forEach(query => allQueries.push(query.name));
    const hasModelWithoutQuery = allModels.some(model => !includes(allQueries, model));
    logger().info('models without queries', hasModelWithoutQuery);
    expect(hasModelWithoutQuery).toBeFalsy();
  });
});
