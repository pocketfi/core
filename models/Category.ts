import { Schema, model} from 'mongoose';
import {ICategory} from "../types/interfaces/ICategory";
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

const Category = model<ICategory>('category', CategorySchema);

export default Category;