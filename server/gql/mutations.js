import { GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import upperFirst from 'lodash/upperFirst';
import { deletedId, deleteUsingId, updateUsingId } from '@database/dbUtils';
import { getQueryFields, TYPE_ATTRIBUTES } from '@utils/gqlFieldUtils';
import { getGqlModels } from '@server/utils/autogenHelper';

export const createResolvers = (model, customResolver) => ({
  createResolver: (parent, args, context, resolveInfo) =>
    customResolver ? customResolver(model, args, context) : model.create(args),
  updateResolver: (parent, args, context, resolveInfo) =>
    customResolver ? customResolver(model, args, context) : updateUsingId(model, args),
  deleteResolver: (parent, args, context, resolveInfo) =>
    customResolver ? customResolver(model, args, context) : deleteUsingId(model, args)
});

export const DB_TABLES = getGqlModels({ type: 'Mutations', blacklist: ['aggregate', 'timestamps'] });

export const addMutations = () => {
  const mutations = {};

  Object.keys(DB_TABLES).forEach(table => {
    const { id, ...createArgs } = DB_TABLES[table].args;

    mutations[`create${upperFirst(table)}`] = {
      ...DB_TABLES[table],
      args: getQueryFields(createArgs, TYPE_ATTRIBUTES.isCreateRequired),
      resolve: createResolvers(DB_TABLES[table].model, DB_TABLES[table].customCreateResolver).createResolver
    };

    mutations[`update${upperFirst(table)}`] = {
      ...DB_TABLES[table],
      args: getQueryFields(DB_TABLES[table].args, TYPE_ATTRIBUTES.isUpdateRequired),
      resolve: createResolvers(DB_TABLES[table].model, DB_TABLES[table].customUpdateResolver).updateResolver
    };

    mutations[`delete${upperFirst(table)}`] = {
      type: deletedId,
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: createResolvers(DB_TABLES[table].model, DB_TABLES[table].customDeleteResolver).deleteResolver
    };
  });
  return mutations;
};

export const MutationRoot = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...addMutations()
  })
});
