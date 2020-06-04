const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  purchaseDate: {
    type: Date
  },
  quantityPurchased: {
    type: Number,
    required: true
  },
  availableItem: {
    type: Number,
    required: true
  },
  costPrice: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("Product", productSchema);