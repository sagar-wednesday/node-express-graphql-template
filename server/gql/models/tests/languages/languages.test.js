import get from 'lodash/get';
import { graphqlSync, GraphQLSchema } from 'graphql';
import { createFieldsWithType, expectSameTypeNameOrKind } from '@utils/testUtils';
import { QueryRoot } from '@server/gql/queries';
import { MutationRoot } from '@server/gql/mutations';
import { timestamps } from '@gql/models/timestamps';
import { languageFields } from '@gql/models/languages';

const schema = new GraphQLSchema({ query: QueryRoot, mutation: MutationRoot });

let fields = [];

fields = createFieldsWithType({ ...languageFields, ...timestamps });

const query = `
  {
    __type(name: "Language") {
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
describe('Language introspection tests', () => {
  it('should have the correct fields and types', () => {
    const result = graphqlSync({ schema, source: query });
    const languageFieldTypes = get(result, 'data.__type.fields');
    const hasCorrectFieldTypes = expectSameTypeNameOrKind(languageFieldTypes, fields);
    expect(hasCorrectFieldTypes).toBeTruthy();
  });
  it('should have a books connection', () => {
    const result = graphqlSync({ schema, source: query });
    const languageFieldTypes = get(result, 'data.__type.fields');
    const bookField = languageFieldTypes.find(field => field.name === 'books');
    expect(bookField.type.kind).toBe('OBJECT');
    expect(bookField.type.name).toBe('booksConnection');
  });
});
