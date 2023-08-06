import { Schema, model } from "mongoose";

const cartsSchema = new Schema({
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "products",
      },
      quantity: {
        type: Number,
        default: 0,
      },
    },
  ],
});

export default model("carts", cartsSchema);
