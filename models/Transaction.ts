import {Schema, model} from 'mongoose';
import {Transaction} from "../types/interfaces/Transaction";
import * as mongoose from "mongoose";

const TransactionSchema = new Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  transactionType: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category'
  },
  place: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

const Transaction = model<Transaction>('transaction', TransactionSchema);

export default Transaction;