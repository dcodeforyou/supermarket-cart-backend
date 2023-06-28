const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    name: String,
    quantity: Number,
    totalPrice: Number
  }],
  shippingAddress: String,
  paymentMethod: String,
  status: String
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
