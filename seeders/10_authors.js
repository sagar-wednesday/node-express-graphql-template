module.exports = {
  up: queryInterface => {
    const faker = require('faker');
    const range = require('lodash/range');

    const arr = range(1, 20).map((value, index) => ({
      name: faker.commerce.productName(),
      country: faker.address.country(),
      age: 20 + index,
      book_id: index + 1
    }));
    return queryInterface.bulkInsert('authors', arr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('authors', null, {})
};
