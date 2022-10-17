import range from 'lodash/range';
import faker from 'faker';
import md5 from 'md5';
const createdBefore = parseInt(Math.random() * 1000);

export const addressesTable = range(1, 10).map((_, index) => ({
  id: (index + 1).toString(),
  address1: faker.address.streetName(),
  address2: faker.address.streetAddress(),
  city: faker.address.city(),
  country: faker.address.country(),
  lat: faker.address.latitude(),
  long: faker.address.longitude()
}));

export const usersTable = range(1, 10).map((_, index) => ({
  id: (index + 1).toString(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  password: md5(faker.internet.password()),
  created_at: faker.date.recent(createdBefore)
}));

export const productsTable = range(1, 10).map((_, index) => ({
  id: (index + 1).toString(),
  name: faker.commerce.productName(),
  category: 'Sports',
  amount: faker.commerce.price()
}));

export const purchasedProductsTable = range(1, 10).map((_, index) => ({
  id: (index + 1).toString(),
  productId: (index + 1).toString(),
  price: 500,
  discount: faker.datatype.number(20),
  deliveryDate: faker.date.recent(createdBefore),
  storeId: (index + 2).toString()
}));

export const storesTable = range(1, 10).map((_, index) => ({
  id: (index + 1).toString(),
  name: faker.company.companyName(),
  addressId: index + 1
}));

export const storeProductsTable = range(1, 10).map((_, index) => ({
  id: (index + 1).toString(),
  productId: index + 1,
  storeId: index + 1
}));

export const suppliersTable = range(1, 10).map((_, index) => ({
  id: (index + 1).toString(),
  name: faker.company.companyName(),
  addressId: index + 1
}));

export const supplierProductsTable = range(1, 10).map((_, index) => ({
  id: (index + 1).toString(),
  productId: index + 1,
  supplierId: index + 1
}));

export const publishersTable = range(1, 10).map((_, index) => ({
  id: (index + 1).toString(),
  name: faker.commerce.productName(),
  country: faker.address.country()
}));

export const languagesTable = range(1, 10).map((_, index) => ({
  id: (index + 1).toString(),
  language: faker.address.country()
}));

export const booksTable = range(1, 10).map((_, index) => ({
  id: (index + 1).toString(),
  name: faker.commerce.productName(),
  genres: faker.commerce.department(),
  pages: parseFloat(faker.commerce.price()),
  publisher_id: index + 1
}));

export const authorsTable = range(1, 10).map((_, index) => ({
  id: (index + 1).toString(),
  name: faker.commerce.productName(),
  country: faker.address.country(),
  age: 20 + index
}));

export const authorsBooksTable = range(1, 10).map((_, index) => ({
  id: (index + 1).toString(),
  author_id: index + 1,
  book_id: index + 1
}));

export const booksLanguagesTable = range(1, 10).map((_, index) => ({
  id: (index + 1).toString(),
  language_id: index + 1,
  book_id: index + 1
}));

export const DB_ENV = {
  POSTGRES_HOST: 'host',
  POSTGRES_PORT: 5432,
  POSTGRES_USER: 'user',
  POSTGRES_PASSWORD: 'password',
  POSTGRES_DB: 'table'
};
