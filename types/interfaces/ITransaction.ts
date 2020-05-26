import {Document} from 'mongoose';
import {ICategory} from "./ICategory";

export interface ITransaction extends Document {
  id: string,
  transactionType: string,
  category: ICategory,
  place: string,
  price: number,
  currency: string,
  created: Date,
  description: string
}