import * as dotenv from 'dotenv';
import * as mongoDB from 'mongodb';

import Place from '../models/place';
import Product from '../models/product';
import User from '../models/user';

export const collections: {
  users?: mongoDB.Collection<User>;
  product?: mongoDB.Collection<Product>;
  place?: mongoDB.Collection<Place>;
} = {};

export async function connectToDatabase() {
  dotenv.config();

  const client: mongoDB.MongoClient = new mongoDB.MongoClient(
    process.env.DB_CONN_STRING || ""
  );

  await client.connect();

  const db: mongoDB.Db = client.db(process.env.DB_NAME);

  await applySchemaValidation(db);

  const usersCollection: mongoDB.Collection<User> = db.collection<User>(
    process.env.USERS_COLLECTION_NAME || ""
  );
  const productCollection: mongoDB.Collection<Product> = db.collection<Product>(
    process.env.PRODUCT_COLLECTION_NAME || ""
  );
  const placeCollection: mongoDB.Collection<Place> = db.collection<Place>(
    process.env.PLACE_COLLECTION_NAME || ""
  );

  collections.users = usersCollection;
  collections.product = productCollection;
  collections.place = placeCollection;

  console.log(
    `Successfully connected to database: ${db.databaseName} and collection: ${usersCollection.collectionName}`
  );
}

async function applySchemaValidation(db: mongoDB.Db) {
  const jsonUserSchema = {
    $jsonSchema: {
      bsonType: "object",
      required: ["chatID", "balance"],
      additionalProperties: false,
      properties: {
        _id: {},
        chatID: {
          bsonType: "number",
          description: "'chatID' is required and is a number",
        },
        balance: {
          bsonType: "number",
          description: "'balance' is required and is a number",
        },
      },
    },
  };

  const jsonProductSchema = {
    $jsonSchema: {
      bsonType: "object",
      required: ["place", "name", "price", "amount", "iid"],
      additionalProperties: false,
      properties: {
        _id: {},
        place: {
          bsonType: "string",
          description: "'place' is required and is a string",
        },
        name: {
          bsonType: "string",
          description: "'name' is required and is a string",
        },
        price: {
          bsonType: "number",
          description: "'price' is required and is a number",
        },
        amount: {
          bsonType: "number",
          description: "'amount' is required and is a number",
        },
        iid: {
          bsonType: "number",
          description: "'iid' is required and is a number",
        },
      },
    },
  };

  const jsonPlaceSchema = {
    $jsonSchema: {
      bsonType: "object",
      required: ["name"],
      additionalProperties: false,
      properties: {
        _id: {},
        name: {
          bsonType: "string",
          description: "'name' is required and is a number",
        },
      },
    },
  };

  // Try applying the modification to the collection, if the collection doesn't exist, create it
  await db
    .command({
      collMod: process.env.USERS_COLLECTION_NAME,
      validator: jsonUserSchema,
    })
    .catch(async (error: mongoDB.MongoServerError) => {
      if (error.codeName === "NamespaceNotFound") {
        await db.createCollection(process.env.USERS_COLLECTION_NAME || "", {
          validator: jsonUserSchema,
        });
      }
    });

  await db
    .command({
      collMod: process.env.PRODUCT_COLLECTION_NAME,
      validator: jsonProductSchema,
    })
    .catch(async (error: mongoDB.MongoServerError) => {
      if (error.codeName === "NamespaceNotFound") {
        await db.createCollection(process.env.PRODUCT_COLLECTION_NAME || "", {
          validator: jsonProductSchema,
        });
      }
    });

  await db
    .command({
      collMod: process.env.PLACE_COLLECTION_NAME,
      validator: jsonPlaceSchema,
    })
    .catch(async (error: mongoDB.MongoServerError) => {
      if (error.codeName === "NamespaceNotFound") {
        await db.createCollection(process.env.PLACE_COLLECTION_NAME || "", {
          validator: jsonPlaceSchema,
        });
      }
    });
}
