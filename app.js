const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const productController = require('./controller/products.controller');
const cartController = require('./controller/carts.controller');
const receiptController = require('./controller/receipt.controller');

// Connect to MongoDB Atlas
const mongodbUri = `mongodb+srv://${process.env.MONGO_ATLAS_USER}:${process.env.MONGO_ATLAS_KEY}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });

const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Get all products  
app.get('/products', productController.getAllProducts);

// create a new Cart
app.post('/carts', cartController.createNewCart);

// create a new Cart
app.get('/carts/count', cartController.getCartCount);

// Add an item to the cart
app.post('/carts/items', cartController.addItemToCart);

// Add an item to the cart
app.get('/carts/items/:productId', cartController.getCartItem);

// Get the cart details
app.get('/carts', cartController.getCartDetails);
  
// update qunatity
app.put('/carts/items/:itemId', cartController.updateQuantity);
  
// Remove an item from cart
app.delete('/carts/items/:itemId', cartController.removeItemFromCart);

// Generate Receipt
app.get('/receipt', receiptController.getReceipt);

  
// Get Dummy User
app.get('/users/current', async (req, res) => {
    const user = "Supermarket User";
    res.json({ user });
})

app.listen(PORT, () => {
    console.log(`Server runnng on port ${PORT}`);
});


  
  