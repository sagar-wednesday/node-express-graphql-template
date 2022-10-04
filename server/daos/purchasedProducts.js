import db from '@database/models';
import { Op } from 'sequelize';

export const insertPurchasedProducts = args => db.purchasedProducts.create(args);

export const getEarliestCreatedDate = async () => {
  const earliestPurchasedProduct = await db.purchasedProducts.findOne({
    order: ['id']
  });
  const date = earliestPurchasedProduct.createdAt.toISOString().split('T')[0];
  return date;
};

export const getTotalByDate = async date => {
  const total = await db.purchasedProducts.sum('price', {
    where: { createdAt: { [Op.lt]: date.endOf('day').toISOString(), [Op.gt]: date.startOf('day').toISOString() } }
  });
  return total || 0;
};

export const getCountByDate = async date => {
  const total = await db.purchasedProducts.count({
    where: { createdAt: { [Op.lt]: date.endOf('day').toISOString(), [Op.gt]: date.startOf('day').toISOString() } }
  });
  return total;
};
