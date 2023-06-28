const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    imageUri: String,
    discount: {
        type: {
            type: String,
            enum: ['individual', 'group'],
            default: 'individual'
        },
        minimumQuantity: Number,
        discountedPrice: Number
    },

});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;