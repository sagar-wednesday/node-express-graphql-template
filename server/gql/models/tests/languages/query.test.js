import get from 'lodash/get';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';
import { booksTable, languagesTable } from '@utils/testUtils/mockData';

describe('Language graphQL-server-DB query tests', () => {
  const languageId = 1;
  const languageOne = `
    query {
      language (id: ${languageId}) {
        id
        language
        books {
          edges {
            node {
              id 
              name
              genres
              pages
            }
          }
        }
      }
    }
  `;

  it('should return all the fields of the language to validate the returning values has the right values that are associated with the given languageId', async () => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);
    jest.spyOn(dbClient.models.books, 'findAll').mockImplementation(() => [booksTable[0]]);

    await getResponse(languageOne).then(response => {
      expect(get(response, 'body.data.language')).toMatchObject({
        id: languagesTable[0].id,
        language: languagesTable[0].language,
        books: {
          edges: [
            {
              node: {
                id: booksTable[0].id,
                name: booksTable[0].name,
                genres: booksTable[0].genres,
                pages: `${booksTable[0].pages}`
              }
            }
          ]
        }
      });
    });
  });

  it('should request for books related to the language', async () => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);

    jest.spyOn(dbClient.models.books, 'findAll').mockImplementation(() => [booksTable[0]]);

    await getResponse(languageOne).then(response => {
      expect(get(response, 'body.data.language')).toBeTruthy();
      // check if books.findAll is being called once
      expect(dbClient.models.books.findAll.mock.calls.length).toBe(1);
      // check if books.findAll is being called with the correct whereclause
      expect(dbClient.models.books.findAll.mock.calls[0][0].include[0].where).toEqual({ languageId });
      // check if the included model has name: books_languages
      expect(dbClient.models.books.findAll.mock.calls[0][0].include[0].model.name).toEqual('books_languages');
    });
  });
});
