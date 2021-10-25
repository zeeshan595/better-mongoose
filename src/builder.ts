import 'reflect-metadata';
import {
  Schema,
  SchemaOptions,
  SchemaDefinitionProperty,
  Model,
  model,
  connect,
  Mongoose,
  ConnectOptions,
} from 'mongoose';

export type SchemaArrayObject = {
  name: string;
  options: SchemaOptions;
};

export type PropertyArrayObject = {
  target: Function;
  key: string | symbol;
  options: SchemaDefinitionProperty<any>;
};

export class SchemaBuilder {
  private connection: Promise<Mongoose>;
  private schemas: Map<Function, SchemaArrayObject> = new Map();
  private properties: Array<PropertyArrayObject> = [];

  addSchema(target: Function, options?: SchemaOptions): void {
    this.schemas.set(target, {
      name: target.name,
      options,
    });
  }
  getSchema(target: Function): SchemaArrayObject {
    return this.schemas.get(target);
  }
  addProperty(
    target: Function,
    key: string | symbol,
    options: SchemaDefinitionProperty<any>
  ): void {
    const fallBackOptions: any = {
      type: Reflect.getMetadata('design:type', target, key),
    };
    this.properties.push({
      target,
      key,
      options: options || fallBackOptions,
    });
  }
  getProperties(target: Function): any {
    return this.properties.reduce(
      (memo, property) =>
        property.target === target
          ? {
              ...memo,
              [property.key]: property.options,
            }
          : memo,
      {}
    );
  }

  getMongoSchema(target: Function): Schema {
    const schemaMeta = this.getSchema(target);
    const propertyMeta = this.getProperties(target);
    return new Schema(propertyMeta, schemaMeta.options);
  }
  async getMongoModel<T extends Function>(target: T): Promise<Model<T>> {
    const db = await this.connection;
    const schemaMeta = this.getSchema(target);
    const schema = this.getMongoSchema(target);
    return db.model<T>(schemaMeta.name, schema);
  }
  connect(uri: string, options: ConnectOptions) {
    this.connection = connect(uri, options);
  }
}

export const schemaBuilder = new SchemaBuilder();
