import { ConnectOptions } from 'mongoose';
import { schemaBuilder } from './builder';

//export schema builder objects
export { SchemaArrayObject, SchemaBuilder, schemaBuilder } from './builder';

// export decorators
export { Property, Schema } from './decorators';

// connect to mongo db
export const connect = (uri: string, options?: ConnectOptions) =>
  schemaBuilder.connect(uri, options);

export const getModel = (target: Function) => schemaBuilder.getModel(target);