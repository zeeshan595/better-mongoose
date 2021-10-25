import { SchemaDefinitionProperty, SchemaOptions } from 'mongoose';
import { schemaBuilder } from './builder';

export const Schema = (options?: SchemaOptions): ClassDecorator => {
  return (target: Function) => {
    schemaBuilder.addSchema(target, options);
  };
};

export const Property = (
  options?: SchemaDefinitionProperty<any>
): PropertyDecorator => {
  return (target: Function, key: string | symbol) => {
    schemaBuilder.addProperty(target, key, options);
  };
};
