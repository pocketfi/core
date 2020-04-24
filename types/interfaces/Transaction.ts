import {Document} from 'mongoose';
import {TransactionType} from "../enums/TransactionType";
import {Category} from "./Category";

export interface Transaction extends Document {
  transactionType: string,
  category: Category,
  place: string,
  price: number,
  currency: string
}