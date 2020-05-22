import {Document} from 'mongoose';
import {Category} from "./Category";

export interface ITransaction extends Document {
  transactionType: string,
  category: Category,
  place: string,
  price: number,
  currency: string,
  created: Date
}