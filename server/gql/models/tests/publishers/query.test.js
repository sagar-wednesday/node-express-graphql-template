import get from 'lodash/get';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';
import { booksTable, publishersTable } from '@utils/testUtils/mockData';

describe('Publisher graphQL-server-DB query tests', () => {
  const publisherId = parseInt(publishersTable[0].id);
  const name = publishersTable[0].name;
  const publisherOne = `
    query {
      publisher (id: ${publisherId}) {
        id
        name
        country
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

  const publisherOneFromName = `
    query {
      publishers (name: "${name}") {
        edges {
          node {
            id
            name
            country
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
      }
    }
  `;

  it('should return all the fields of the publisher to validate the returning values has the right values that are associated with the given publisherId', async () => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);
    jest.spyOn(dbClient.models.books, 'findAll').mockImplementation(() => [booksTable[0]]);

    await getResponse(publisherOne).then(response => {
      expect(get(response, 'body.data.publisher')).toMatchObject({
        id: publishersTable[0].id,
        name: publishersTable[0].name,
        country: publishersTable[0].country,
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

  it('should request for books related to the publisher', async () => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);

    jest.spyOn(dbClient.models.books, 'findAll').mockImplementation(() => [booksTable[0]]);

    await getResponse(publisherOne).then(response => {
      expect(get(response, 'body.data.publisher')).toBeTruthy();
      // check if books.findAll is being called once
      expect(dbClient.models.books.findAll.mock.calls.length).toBe(1);
      // check if books.findAll is being called with the correct whereclause
      expect(dbClient.models.books.findAll.mock.calls[0][0].include[0].where).toEqual({ id: publisherId });
      // check if the included model has name: books_languages
      expect(dbClient.models.books.findAll.mock.calls[0][0].include[0].model.name).toEqual('publishers');
    });
  });

  it('should request for publishers with the provided name', async () => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);
    jest.spyOn(dbClient.models.publishers, 'findAll').mockImplementation(() => [publishersTable[0]]);

    await getResponse(publisherOneFromName).then(response => {
      console.log('publish res', response.body.data.publishers);
      expect(get(response, 'body.data.publishers')).toMatchObject({
        edges: [
          {
            node: {
              id: publishersTable[0].id,
              name: publishersTable[0].name,
              country: publishersTable[0].country,
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
            }
          }
        ]
      });
    });
  });
});
