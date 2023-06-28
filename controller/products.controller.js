const Product = require('../models/product');

// Get all products
async function getAllProducts(req, res) {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  getAllProducts
}