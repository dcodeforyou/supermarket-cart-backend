const dotenv = require('dotenv');
dotenv.config();

const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.MONGO_ATLAS_USER}:${process.env.MONGO_ATLAS_KEY}/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function initializeProducts() {
  try {
    await client.connect();
    console.log('Connected to the database');

    const productsCollection = client.db(`${process.env.DB_NAME}`).collection('products');

    const mockProducts = [
        {
          name: 'Orange',
          price: 40,
          discount: {
            type: 'individual',
            discountedPrice: 35
          }
        },
        {
          name: 'Tomato',
          price: 25
        },
        {
          name: 'Potato',
          price: 20,
          discount: {
            type: 'group',
            minimumQuantity: 5,
            discountedPrice: 80
          }
        },
        {
          name: 'Onion',
          price: 30
        },
        {
          name: 'Eggs',
          price: 60,
          discount: {
            type: 'individual',
            discountedPrice: 55
          }
        },
        {
          name: 'Rice',
          price: 100
        },
        {
          name: 'Pasta',
          price: 50
        },
        {
          name: 'Sugar',
          price: 45,
          discount: {
            type: 'group',
            minimumQuantity: 2,
            discountedPrice: 80
          }
        },
        {
          name: 'Salt',
          price: 15
        },
        {
          name: 'Coffee',
          price: 80,
          discount: {
            type: 'group',
            minimumQuantity: 3,
            discountedPrice: 200
          }
        },
      ];
      
      

    await productsCollection.insertMany(mockProducts);
    console.log('Products data inserted successfully');

    // Close connection
    await client.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error initializing products:', error);
  }
}

initializeProducts();
