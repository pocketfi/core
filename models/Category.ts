import { Schema, model} from 'mongoose';
import {Category} from "../types/interfaces/Category";
import * as mongoose from "mongoose";

const CategorySchema = new Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  name: {
    type: String,
    required: true
  },
  color: {
    type: String
  }
});

const Category = model<Category>('category', CategorySchema);

export default Category;