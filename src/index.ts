import { ConnectOptions, Model } from 'mongoose';
import { schemaBuilder } from './builder';

export { SchemaArrayObject, SchemaBuilder, schemaBuilder } from './builder';
export { Property, Schema } from './decorators';
export const getModel = <T extends Function>(target: T): Promise<Model<T>> =>
  schemaBuilder.getMongoModel(target);
export const connect = (uri: string, options: ConnectOptions) =>
  schemaBuilder.connect(uri, options);
