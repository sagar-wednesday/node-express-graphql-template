import get from 'lodash/get';
import { graphqlSync, GraphQLSchema } from 'graphql';
import { createFieldsWithType, expectSameNameField, expectSameTypeNameOrKind } from '@utils/testUtils';
import { QueryRoot } from '@server/gql/queries';
import { MutationRoot } from '@server/gql/mutations';
import { timestamps } from '@gql/models/timestamps';
import { publisherFields } from '@gql/models/publishers';

const schema = new GraphQLSchema({ query: QueryRoot, mutation: MutationRoot });

let fields = [];

fields = createFieldsWithType({ ...publisherFields, ...timestamps });

const query = `
  {
    __type(name: "Publisher") {
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
describe('Publisher introspection tests', () => {
  const expectedFields = ['id', 'name', 'country', 'createdAt', 'updatedAt', 'deletedAt', 'books'];
  it('should have the correct fields and types', () => {
    const result = graphqlSync({ schema, source: query });
    const publisherFieldTypes = get(result, 'data.__type.fields');

    const hasCorrectFields = expectSameNameField(publisherFieldTypes);

    expect(hasCorrectFields).toEqual(expectedFields);

    const hasCorrectFieldTypes = expectSameTypeNameOrKind(publisherFieldTypes, fields);
    expect(hasCorrectFieldTypes).toBeTruthy();
  });
  it('should have a books connection', () => {
    const result = graphqlSync({ schema, source: query });
    const publisherFieldTypes = get(result, 'data.__type.fields');
    const bookField = publisherFieldTypes.find(field => field.name === 'books');
    expect(bookField.type.kind).toBe('OBJECT');
    expect(bookField.type.name).toBe('booksConnection');
  });
});
