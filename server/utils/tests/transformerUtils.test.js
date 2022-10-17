import { transformDbArrayResponseToRawResponse, convertDbResponseToRawResponse } from '../transformerUtils';

describe('transformerUtils tests', () => {
  const dbResponse = [
    {
      productsInformation: {
        dataValues: {
          category: 'Shoes',
          productName: 'Bata'
        }
      },
      get: () => ({
        productsInformation: {
          category: 'Shoes',
          productName: 'Bata'
        }
      })
    },
    {
      productsInformation: {
        dataValues: {
          category: 'Health'
        }
      },
      get: () => ({
        productsInformation: {
          category: 'Health',
          productName: 'Cipla'
        }
      })
    }
  ];

  const rawResponse = [
    {
      products_information: {
        category: 'Shoes',
        product_name: 'Bata'
      }
    },
    {
      products_information: {
        category: 'Health',
        product_name: 'Cipla'
      }
    }
  ];

  describe('convertDbResponseToRawResponse tests', () => {
    const convertedRes = {
      productsInformation: {
        category: 'Shoes',
        productName: 'Bata'
      }
    };
    it('should call the get method on the response', () => {
      const res = convertDbResponseToRawResponse(dbResponse[0]);
      expect(res).toEqual(convertedRes);
    });
  });

  describe('transformDbArrayResponseToRawResponse tests', () => {
    it('should transform the array response to raw response ', () => {
      const { transformDbArrayResponseToRawResponse } = require('../transformerUtils');
      const res = transformDbArrayResponseToRawResponse(dbResponse);
      expect(res).toEqual(rawResponse);
    });
    it('should throw error if the response passed in argument is not an object', () => {
      expect(transformDbArrayResponseToRawResponse).toThrowError('The required type should be an object(array)');
    });
  });
});
