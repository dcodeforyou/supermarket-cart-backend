const Cart = require('../models/cart');
const Product = require('../models/product');

// create a new Cart
async function createNewCart(req, res) {
    try {
        const cart = new Cart();
        await cart.save();
        res.json({cartId: cart._id});
    } catch (err) {
        res.status(500).json({message: 'An error occured', error: err });
    }
}

// get cart count
async function getCartCount(req, res) {
    try {
        const cart = await Cart.findOne({});
      
        if (!cart) {
          res.json({ count: 0 });
        } else {
          // Cart found, returning count of items in the cart
          const itemCount = cart.items.length;
          res.json({ count: itemCount });
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

// Add an item to the cart
async function addItemToCart(req, res) {
    try {
      const { productId, quantity } = req.body;
  
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      const itemTotalPrice = calculateItemTotalPrice(product, quantity);
      console.log(itemTotalPrice);
  
      let cart = await Cart.findOne({});
  
      if (!cart) {
        // Create a new cart if not exist
        cart = new Cart();
        cart.user = "Supermarket User";
      }
      console.log('Cart total: ', cart.totalPrice);
      const existingItem = cart.items.find(item => item.productId.toString() === productId);
      let oldPrice = 0;
      if (existingItem) {
        // Update quantity and total price of existing item in the cart
        existingItem.quantity = quantity;
        oldPrice = existingItem.totalPrice;
        existingItem.totalPrice = itemTotalPrice;
        console.log(existingItem.quantity, oldPrice);
      } else {
        // Add a new item to the cart
        cart.items.push({
          productId,
          name: product.name,
          quantity,
          totalPrice: itemTotalPrice
        });
        console.log('Pushed in items')
      }
      console.log(cart);
      console.log(itemTotalPrice);
      cart.totalPrice += (itemTotalPrice - oldPrice);
      console.log(cart.totalPrice);
      const savedCart = await cart.save();
      res.json(savedCart);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Get cart Item
async function getCartItem(req, res) {
    try {
        const productId = req.params.productId;
    
        let cart = await Cart.findOne({});
    
        if (!cart) {
          return res.status(404).json({ error: 'Cart not found' });
        }
    
        const cartItem = cart.items.find(item => item.productId.toString() === productId);
    
        if (!cartItem) {
          const product = await Product.findById(productId);
          return res.json({ 
              productId,
              name: product.name,
              quantity: 0,
              totalPrice: 0
          });
        }
    
        res.json(cartItem);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}
  


// Get the cart details
async function getCartDetails(req, res) {
    try {
      const cart = await Cart.findOne({});
      
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
      
      res.json(cart);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}

  
// update qunatity
async function updateQuantity(req, res) {
    try {
      const itemId = req.params.itemId;
      const { quantity } = req.body;
  
      let cart = await Cart.findOne({});
  
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
  
      const item = cart.items.find(item => item._id.toString() === itemId);
  
      if (!item) {
        return res.status(404).json({ error: 'Item not found in cart' });
      }
  
      const oldQuantity = item.quantity;
      item.quantity = quantity;
      const oldPrice = item.totalPrice;
      const product = await Product.findById(item.productId);
      item.totalPrice = calculateItemTotalPrice(product, quantity);
      console.log(item.totalPrice);
      cart.totalPrice += (item.totalPrice - oldPrice);
  
      const savedCart = await cart.save();
      res.json(savedCart);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}
  

// Remove an item from cart
async function removeItemFromCart(req, res) {
    try {
      const itemId = req.params.itemId;
  
      let cart = await Cart.findOne({});
  
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
  
      const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
  
      if (itemIndex === -1) {
        return res.status(404).json({ error: 'Item not found in cart' });
      }
  
      const item = cart.items[itemIndex];
  
      cart.totalPrice -= item.totalPrice;
      cart.items.splice(itemIndex, 1);
  
      const savedCart = await cart.save();
      res.json(savedCart);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Calculate total price for an item based on its quantity and discount
function calculateItemTotalPrice(product, quantity) {
    let totalPrice = 0;
    console.log(product);
    console.log(quantity);
    if (product.discount && product.discount.type === 'group' && quantity >= product.discount.minimumQuantity) {
      // Apply group discount
      const discountedPrice = product.discount.discountedPrice;
      totalPrice = discountedPrice * quantity;
      console.log('TP: ', totalPrice);
    } else if (product.discount && product.discount.type === 'individual') {
      // Apply individual discount
      const discountedPrice = product.discount.discountedPrice || product.price;
      console.log(discountedPrice);
      totalPrice = discountedPrice * quantity;
      console.log('cal price', totalPrice);
    } else {
      // No discount, use regular price
      totalPrice = product.price * quantity;
    }
  
    return totalPrice;
  }

module.exports = {
    createNewCart,
    getCartCount,
    addItemToCart,
    getCartItem,
    updateQuantity,
    getCartDetails,
    removeItemFromCart
}