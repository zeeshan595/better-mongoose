import 'reflect-metadata';
import {
  SchemaOptions,
  SchemaDefinitionProperty,
  Model,
  connect,
  Mongoose,
  ConnectOptions,
  Collection,
} from 'mongoose';

export type SchemaArrayObject = {
  target: Function;
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
  private schemas: Array<SchemaArrayObject> = [];
  private properties: Array<PropertyArrayObject> = [];
  private models: Map<Function, Model<any>> = new Map();

  addSchema(target: Function, options?: SchemaOptions): void {
    this.schemas.push({
      target,
      name: target.name,
      options,
    });
  }
  addProperty(
    target: Function,
    schemaTarget: Function,
    key: string | symbol,
    options: SchemaDefinitionProperty<any>
  ): void {
    const fallBackOptions: any = {
      type: Reflect.getMetadata('design:type', target, key),
    };
    this.properties.push({
      target: schemaTarget,
      key,
      options: options || fallBackOptions,
    });
  }
  async getMongoModel<T extends Function>(target: T): Promise<Model<T>> {
    await this.connection;
    return this.models.get(target);
  }
  async getMongoCollection<T extends Function>(target: T): Promise<Collection> {
    await this.connection;
    return this.models.get(target).collection;
  }
  async getConnection(): Promise<Mongoose> {
    return await this.connection;
  }
  connect(uri: string, options?: ConnectOptions) {
    this.connection = new Promise(async (resolve, reject) => {
      try {
        const db = await connect(uri, options);
        for (const schema of this.schemas) {
          // get schema properties object
          const schemaProperties = this.properties
            .filter((prop) => prop.target === schema.target)
            .reduce(
              (prev, next) => ({
                ...prev,
                [next.key]: next.options,
              }),
              {}
            );

          const mongooseSchema = new db.Schema(
            schemaProperties,
            schema.options
          );
          this.models.set(
            schema.target,
            db.model<any>(schema.name, mongooseSchema)
          );
        }
        resolve(db);
      } catch (e) {
        reject(e);
      }
    });
  }
}

export const schemaBuilder = new SchemaBuilder();
