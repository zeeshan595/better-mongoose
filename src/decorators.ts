import {
  SchemaDefinitionProperty,
  SchemaType,
  Types,
  Schema as MongooseSchema,
} from 'mongoose';
import { schemaBuilder, SchemaOptionsExtended } from './builder';

export const Schema = (options?: SchemaOptionsExtended): ClassDecorator => {
  return (target: Function) => {
    schemaBuilder.addSchema(target, options);
  };
};

export const Property = (
  options?: SchemaDefinitionProperty<any>
): PropertyDecorator => {
  return (target: Function, key: string | symbol) => {
    if (!options) {
      options = {};
      if (key === '_id') {
        options = { auto: true };
      }
    }
    if (!options['type']) {
      options['type'] = Reflect.getMetadata('design:type', target, key);
    }
    options['type'] = getMongoType(options['type']);
    schemaBuilder.addProperty(target, target.constructor, key, options);
  };
};

export const getMongoType = (type: any): any => {
  const knownTypes = [Boolean, Date, Number, String];
  if (knownTypes.indexOf(type) > -1) {
    return type;
  }
  if (type.prototype instanceof SchemaType) {
    return type;
  }
  if (type === Types.ObjectId) {
    return MongooseSchema.Types.ObjectId;
  }
  if (type == Array) {
    return [MongooseSchema.Types.Mixed];
  }
  return MongooseSchema.Types.Mixed;
};
