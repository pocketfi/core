import * as mongoose from 'mongoose'
import {model, Schema} from 'mongoose'
import {ICategory} from '../types/interfaces/ICategory'

const CategorySchema = new Schema({
  user: {
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
})

CategorySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc: any, ret: any) => {
    ret.id = ret._id
    delete ret._id
  }
})

const Category = model<ICategory>('category', CategorySchema)

export default Category
