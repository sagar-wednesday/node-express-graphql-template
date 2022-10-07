import get from 'lodash/get';
import { graphqlSync, GraphQLSchema } from 'graphql';
import { createFieldsWithType, expectSameNameField, expectSameTypeNameOrKind } from '@utils/testUtils';
import { QueryRoot } from '@server/gql/queries';
import { MutationRoot } from '@server/gql/mutations';
import { timestamps } from '@gql/models/timestamps';
import { booksFields } from '@gql/models/books';

const schema = new GraphQLSchema({ query: QueryRoot, mutation: MutationRoot });

let fields = [];

fields = createFieldsWithType({ ...booksFields, ...timestamps });

const query = `
  {
    __type(name: "Book") {
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
describe('Book introspection tests', () => {
  const expectedFields = [
    'id',
    'name',
    'genres',
    'pages',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'authors',
    'languages',
    'publishers'
  ];

  it('should have the correct fields and types', () => {
    const result = graphqlSync({ schema, source: query });
    const bookFieldTypes = get(result, 'data.__type.fields');
    const hasCorrectFields = expectSameNameField(bookFieldTypes);

    expect(hasCorrectFields).toEqual(expectedFields);

    const hasCorrectFieldTypes = expectSameTypeNameOrKind(bookFieldTypes, fields);
    expect(hasCorrectFieldTypes).toBeTruthy();
  });
  it('should have a authors connection', () => {
    const result = graphqlSync({ schema, source: query });
    const bookFieldTypes = get(result, 'data.__type.fields');
    const authorField = bookFieldTypes.find(field => field.name === 'authors');
    expect(authorField.type.kind).toBe('OBJECT');
    expect(authorField.type.name).toBe('AuthorConnection');
  });
  it('should have a languages connection', () => {
    const result = graphqlSync({ schema, source: query });
    const bookFieldTypes = get(result, 'data.__type.fields');
    const languageField = bookFieldTypes.find(field => field.name === 'languages');
    expect(languageField.type.kind).toBe('OBJECT');
    expect(languageField.type.name).toBe('LanguageConnection');
  });
  it('should have a authors connection', () => {
    const result = graphqlSync({ schema, source: query });
    const bookFieldTypes = get(result, 'data.__type.fields');
    const publisherField = bookFieldTypes.find(field => field.name === 'publishers');
    expect(publisherField.type.kind).toBe('OBJECT');
    expect(publisherField.type.name).toBe('PublisherConnection');
  });
});
