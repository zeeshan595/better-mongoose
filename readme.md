# Better Mongoose

This project is a wrapper for mongoose.
It allows you to use decorators in your typescript to implement mongoose.
Everything passed through your decorators get's sent directly to mongoose.

# Getting Started

```bash
# install package
npm install better-mongoose --save
```

# Sample

```ts
import { ObjectID } from 'mongodb';
import {
  Schema,
  Property,
  connect,
  getModel,
  getCollection,
} from 'better-mongoose';

// connect to database using better-mongoose (mongoose under the hood)
connect('mongodb://root:myPassword@localhost:27017/?ssl=false');

// create your structure
@Schema(/* Mongoose schema options here */)
export class User {
  @Property(/* Mongoose Property options here */)
  username: string;

  @Property({
    length: 50,
  })
  firstname: string;

  @Property()
  lastname: string;
}

// find single user using object id
async function FindUser() {
  const userModel = await getModel(User);
  const findResult = await userModel.findOne({
    $where: function () {
      return this._id === new ObjectID(id);
    },
  });
}

// get paginated users using model
async function GetUsers() {
  const userModel = await getModel(User);
  const findResult = await userModel
    .find()
    .skip(limit * page)
    .limit(limit);
}

// create user using model
async function CreateUser() {
  const userModel = await getModel(User);
  const insertResult = await userModel.create({
    username: 'john',
    firstname: 'john',
    lastname: 'Doe',
  });
}
```

`supports arrays and sub-collections`

```ts
@Schema()
export class Tool {
  @Property()
  name: string;
}

export class Details {
  @Property()
  address: string;
}

@Schema()
export class User {
  @Property()
  username: string;
  
  @Property()
  tools: SubCollection[];

  @Property()
  details: Details;
}
```
