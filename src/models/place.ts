import { ObjectId } from "mongodb";

export default class Place {
    constructor(
        public name: string,
        public id?: ObjectId
    ) {}
}