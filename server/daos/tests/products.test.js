const { redis } = require('@server/services/redis');
const { getAllCategories } = require('../products');

describe('Products dao tests', () => {
  describe('getAllCategories tests', () => {
    const categories = ['Tools', 'Electronics', 'Sports', 'Books', 'Clothing', 'Kids', 'Music'];
    it('should return the categories data from redis', async () => {
      jest.spyOn(redis, 'get').mockReturnValueOnce(JSON.stringify(categories));
      const res = await getAllCategories();
      expect(res).toEqual(categories);
    });
  });
});
