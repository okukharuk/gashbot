
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
import User from "../models/user";

export const collections: { users?: mongoDB.Collection<User> } = {}

export async function connectToDatabase () {
    dotenv.config();
 
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING || '');
            
    await client.connect();
        
    const db: mongoDB.Db = client.db(process.env.DB_NAME);

    await applySchemaValidation(db);
   
    const usersCollection: mongoDB.Collection<User> = db.collection<User>(process.env.USERS_COLLECTION_NAME || '');
 
    collections.users = usersCollection;
       
    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${usersCollection.collectionName}`);
 }

 async function applySchemaValidation(db: mongoDB.Db) {
    const jsonSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["chatID", "balance"],
            additionalProperties: false,
            properties: {
                _id: {},
                chatID: {
                    bsonType: "number",
                    description: "'chatID' is required and is a string",
                },
                balance: {
                    bsonType: "number",
                    description: "'balance' is required and is a number",
                },
            },
        },
    };

    // Try applying the modification to the collection, if the collection doesn't exist, create it 
   await db.command({
        collMod: process.env.USERS_COLLECTION_NAME,
        validator: jsonSchema
    }).catch(async (error: mongoDB.MongoServerError) => {
        if (error.codeName === 'NamespaceNotFound') {
            await db.createCollection(process.env.USERS_COLLECTION_NAME || '', {validator: jsonSchema});
        }
    });
}