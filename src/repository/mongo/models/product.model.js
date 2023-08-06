import { Schema, model } from "mongoose";

import mongoosePaginate from "mongoose-paginate-v2";

const productsSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  thumbnail: {
    //array de strings
    type: [String],
  },
});

productsSchema.plugin(mongoosePaginate);

export default model("products", productsSchema);
