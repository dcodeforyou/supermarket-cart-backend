const Cart = require('../models/cart');

// Generate receipt of items that are in the cart
async function getReceipt(res, res) {
    try {
      const cart = await Cart.findOne({}).populate('items.productId');
  
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
  
      const receipt = {
        items: [],
        totalPriceAfterDiscount: cart.totalPrice,
        user: cart.user,
        timestamp: cart.timestamp
      };
      
      // Update name, quantity and price of items from cart
      for (const item of cart.items) {
        const { name, quantity, totalPrice } = item;
        receipt.items.push({ name, quantity, totalPrice });
      }
  
      res.json(receipt);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getReceipt
}