import { ObjectId } from 'mongodb';

export default class User {
  constructor(
    public chatID: number,
    public balance: number,
    public id?: ObjectId
  ) {}
}
