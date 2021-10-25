import { Model } from 'mongoose';
import { schemaBuilder } from './builder';

export { SchemaArrayObject, SchemaBuilder, schemaBuilder } from './builder';
export { Property, Schema } from './decorators';
export const getModel = <T extends Function>(target: T): Model<T> =>
  schemaBuilder.getMongoModel(target);
