import express, { Request, Response } from "express";
import { collections } from "../services/db.service";
import Product from "../models/product";

export const productRouter = express.Router();

productRouter.use(express.json());

productRouter.get("/", async (_req: Request, res: Response) => {
    try {
       const products = (await collections.product?.find({}).toArray()) as Product[];

        res.status(200).send(products);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});

productRouter.get("/:name", async (req: Request, res: Response) => {
    const name = req?.params?.name;

    try {
        
        const query = { name: name };
        const product = (await collections.product?.findOne(query)) as Product;

        if (product) {
            res.status(200).send(product);
        }
    } catch (error: any) {
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
});

productRouter.post("/", async (req: Request, res: Response) => {
    try {
        const newProduct = req.body as Product;
        const result = await collections.product?.insertOne(newProduct);

        result
            ? res.status(201).send(`Successfully created a new product with id ${result.insertedId}`)
            : res.status(500).send("Failed to create a new product.");
    } catch (error: any) {
        console.error(error);
        res.status(400).send(error.message);
    }
});

productRouter.put("/:name", async (req: Request, res: Response) => {
    const name = req?.params?.name;

    try {
        const updatedProduct: Product = req.body as Product;
        const query = { name: name };
      
        const result = await collections.product?.updateOne(query, { $set: updatedProduct });

        result
            ? res.status(200).send(`Successfully updated product with name ${name}`)
            : res.status(304).send(`Product with name: ${name} not updated`);
    } catch (error: any) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});

productRouter.delete("/:name", async (req: Request, res: Response) => {
    const name = req?.params?.name;

    try {
        const query = { name: name };
        const result = await collections.product?.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed product with name ${name}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove product with name ${name}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Product with name ${name} does not exist`);
        }
    } catch (error: any) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});