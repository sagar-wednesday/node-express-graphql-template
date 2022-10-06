import get from 'lodash/get';
import { graphqlSync, GraphQLSchema } from 'graphql';
import { createFieldsWithType, expectSameTypeNameOrKind } from '@utils/testUtils';
import { QueryRoot } from '@server/gql/queries';
import { MutationRoot } from '@server/gql/mutations';
import { authorsFields } from '@gql/models/authors';
import { timestamps } from '@gql/models/timestamps';

const schema = new GraphQLSchema({ query: QueryRoot, mutation: MutationRoot });

let fields = [];

fields = createFieldsWithType({ ...authorsFields, ...timestamps });

const query = `
  {
    __type(name: "Author") {
        name
        kind
        fields {
          name
          type {
            name
            kind
          }
        }
      }    
  }
`;
describe('Author introspection tests', () => {
  it('should have the correct fields and types', () => {
    const result = graphqlSync({ schema, source: query });
    const authorFieldTypes = get(result, 'data.__type.fields');
    const hasCorrectFieldTypes = expectSameTypeNameOrKind(authorFieldTypes, fields);
    expect(hasCorrectFieldTypes).toBeTruthy();
  });
  it('should have a books connection', () => {
    const result = graphqlSync({ schema, source: query });
    const authorFieldTypes = get(result, 'data.__type.fields');
    const bookField = authorFieldTypes.find(field => field.name === 'books');
    expect(bookField.type.kind).toBe('OBJECT');
    expect(bookField.type.name).toBe('booksConnection');
  });
});
