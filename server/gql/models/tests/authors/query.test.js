import get from 'lodash/get';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';
import { booksTable } from '@utils/testUtils/mockData';

describe('Author graphQL-server-DB query tests', () => {
  const authorId = 1;
  const authorOne = `
    query {
        author (id: ${authorId}) {
            id
            name
            country
            age
            books {
                edges {
                    node {
                        id 
                    }
                }
            }
        }
    }
  `;

  it('should request for books related to the author', async () => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);

    jest.spyOn(dbClient.models.books, 'findAll').mockImplementation(() => [booksTable[0]]);

    await getResponse(authorOne).then(response => {
      expect(get(response, 'body.data.author')).toBeTruthy();
      // check if books.findAll is being called once
      expect(dbClient.models.books.findAll.mock.calls.length).toBe(1);
      // check if books.findAll is being called with the correct whereclause
      expect(dbClient.models.books.findAll.mock.calls[0][0].include[0].where).toEqual({ authorId });
      // check if the included model has name: authors_books
      expect(dbClient.models.books.findAll.mock.calls[0][0].include[0].model.name).toEqual('authors_books');
    });
  });
});
