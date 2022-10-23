import { ObjectId } from 'mongodb';

export default class Product {
  constructor(
    public place: string,
    public name: string,
    public price: number,
    public amount: number,
    public id?: ObjectId
  ) {}
}
