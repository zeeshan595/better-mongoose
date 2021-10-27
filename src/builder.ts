import 'reflect-metadata';
import {
  SchemaOptions,
  SchemaDefinitionProperty,
  Model,
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
  private model: Map<Function, Model<any>> = new Map();

  // setup schema options
  addSchema(target: Function, options?: SchemaOptions): void {
    this.schemas.set(target, {
      name: target.name,
      options,
    });
  }

  // add schema property
  addProperty(
    target: Function,
    schemaTarget: Function,
    key: string | symbol,
    options: SchemaDefinitionProperty<any>
  ): void {
    this.properties.push({
      target: schemaTarget,
      key,
      options,
    });
  }

  // get model from mongoose
  async getModel<T extends Function>(target: T): Promise<Model<T>> {
    if (this.model.has(target)) {
      return this.model.get(target);
    }

    const conn = await this.connection;

    const sch = this.schemas.get(target);
    const properties = this.properties
      .filter((prop) => prop.target === target)
      .reduce(
        (prev, next) => ({
          ...prev,
          [next.key]: next.options,
        }),
        {}
      );

    const schema = new conn.Schema(properties, sch.options);
    const model = conn.model(sch.name, schema);
    this.model.set(target, model);
    return model;
  }

  // connect to the database
  connect(uri: string, options?: ConnectOptions) {
    this.connection = connect(uri, options);
  }
}

export const schemaBuilder = new SchemaBuilder();
