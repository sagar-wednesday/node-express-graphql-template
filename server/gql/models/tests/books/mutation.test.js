import get from 'lodash/get';
import { getResponse } from '@utils/testUtils';
import { booksTable } from '@utils/testUtils/mockData';

describe('Address graphQL-server-DB mutation tests', () => {
  const createBookMutation = `
    mutation {
      createBook (
          name: "${booksTable[0].name}",
          genres: "${booksTable[0].genres}",
          pages: "${booksTable[0].pages}",
          publisherId: "1",
          authorsId: [{authorId: 1}],
          languagesId: [{languageId: 1}]
        ) {
          id
          name
          genres
          pages
          createdAt
          updatedAt
          deletedAt
          authors {
              edges {
                  node {
                      id
                  }
              }
          }
        }
    }
`;

  const updateBookMutation = `
    mutation {
        updateBook (
          id: 1,
          name: "Glitter in Sky",
          genres: "Fantasy",
          pages: "201",
          publisherId: "2",
          authorsId: [{authorId: 2}],
          languagesId: [{languageId: 2}]
        ) {
            id
        }
    }
  `;

  const deleteBookMutation = `mutation DeleteLanguage {
    deleteBook(id: ${booksTable[0].id}) {
      id
    }
  }`;

  it('should have a mutation to create a new book', async () => {
    const response = await getResponse(createBookMutation);
    const result = get(response, 'body.data.createBook');
    expect(result).toMatchObject({
      id: booksTable[0].id,
      name: booksTable[0].name,
      genres: booksTable[0].genres,
      pages: `${booksTable[0].pages}`
    });
  });

  it('should have a mutation to update a new author', async () => {
    const response = await getResponse(updateBookMutation);
    const result = get(response, 'body.data.updateBook');

    expect(result).toMatchObject({
      id: '1'
    });
  });

  it('should have a mutation to delete an author', async () => {
    const response = await getResponse(deleteBookMutation);
    const result = get(response, 'body.data.deleteBook');

    expect(result).toEqual(
      expect.objectContaining({
        id: 1
      })
    );
  });
});
