import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: function () {
      return Math.random().toString(36).slice(2, 9);
    },
  },
  name: { type: String, required: true },
  supermarket: { type: String, required: true },
  price: { type: String, required: true },
  img: { type: String, required: true },
  unitCost: { type: String, required: false },
  promotion: { type: String, required: false },
  validity: { type: String, required: false },
  update: { type: String, required: false },
});

export const ProductModel = mongoose.model("Products", ProductSchema);
