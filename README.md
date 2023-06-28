## Supermarket Cart Backend

This repository contains the backend code for the Supermarket Cart application. The Supermarket Cart is a simple cart management system that allows users to add products to their cart, apply discounts, manage quantities, and generate receipts. This backend code is built with Node.js, Express, and MongoDB.

### Features

- Get previous cart items: View the list of available products with prices and discounts. When the application loads, it retrieves the previous cart items that were already added. The cart state is managed through MongoDB Atlas.
- Discounts on product listing: The product listing displays any applicable discounts for the products.
- Add products to the shopping cart - Users can add items to the cart. If an individual item has a discount, the discounted price will be applied.
- Group discounts: If a group discount is available, after adding the minimum required quantity of products, the discounted price for each item will be applied.
- Managing quantity: Users can increment or decrement the quantity of products from the products page.
- Increment or decrement the quantity of items in the cart.
- Managing cart items: Users can increment, decrement, or remove items from the cart page.
- View the cart contents and total price.
- Checkout and receipt: Users can proceed to checkout to view the receipt, which includes the discounted price, user information, and timestamp.

### API Endpoints

The following API endpoints are available:

- `POST /api/auth/signup`: Sign up a new user.
- `POST /api/auth/login`: Log in an existing user.
- `GET /api/products`: Retrieve all products.
- `POST /api/carts`: Create a new cart.
- `GET /api/carts/count`: Get the item count in the cart.
- `POST /api/carts/items`: Add an item to the cart.
- `GET /api/carts/items/:productId`: Get a specific cart item by product ID.
- `GET /api/carts`: Get the cart details.
- `PUT /api/carts/items/:itemId`: Update the quantity of a cart item.
- `DELETE /api/carts/items/:itemId`: Remove a cart item.
- `GET /api/receipt`: Generate a receipt.
- `GET /api/users/current`: Retrieve current user information.

### Deployment

You can experience the Supermarket Cart application live at [https://supermarket-cart.netlify.app](https://supermarket-cart.netlify.app).

### Frontend

The frontend code for the Supermarket Cart application can be found at [https://github.com/dcodeforyou/supermarket-cart-frontend](https://github.com/dcodeforyou/supermarket-cart-frontend). The frontend is built with Angular and interacts with this backend to provide the user interface and functionality.

### Installation

To run the Supermarket Cart backend locally, follow these steps:

1. Clone this repository: `git clone https://github.com/dcodeforyou/supermarket-cart-backend.git`
2. Install dependencies: `npm install`
3. Set up the environment variables by creating a `.env` file and providing the required values.
4. Start the server: `npm start`
5. The backend will be running at `http://localhost:3000`.

### Testing

Tests are written using Jest framework

