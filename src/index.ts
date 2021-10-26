import { Collection, ConnectOptions, Model, Mongoose } from 'mongoose';
import { schemaBuilder } from './builder';

//export schema builder objects
export { SchemaArrayObject, SchemaBuilder, schemaBuilder } from './builder';

// export decorators
export { Property, Schema } from './decorators';

// connect to mongo db
export const connect = (uri: string, options?: ConnectOptions) =>
  schemaBuilder.connect(uri, options);

// get connection
export const getConnection = (): Promise<Mongoose> =>
  schemaBuilder.getConnection();

// get model
export const getModel = <T extends Function>(target: T): Promise<Model<T>> =>
  schemaBuilder.getMongoModel(target);

// get collection
export const getCollection = <T extends Function>(
  target: T
): Promise<Collection> => schemaBuilder.getMongoCollection(target);
