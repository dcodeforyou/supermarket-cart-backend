const Cart = require('../models/cart');
const Product = require('../models/product');
const {
  createNewCart,
  addItemToCart,
  updateQuantity,
  getCartDetails,
  removeItemFromCart,
} = require('../controller/carts.controller');

jest.mock('../models/cart');
jest.mock('../models/product');

describe('Cart Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createNewCart', () => {
    it('should create a new cart and return its ID', async () => {
      const mockSavedCart = { _id: '123456789', save: jest.fn() };
      Cart.mockImplementationOnce(() => mockSavedCart);

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      await createNewCart({}, mockResponse);

      expect(Cart).toHaveBeenCalledTimes(1);
      expect(mockSavedCart.save).toHaveBeenCalledTimes(1);
      expect(mockResponse.json).toHaveBeenCalledWith({ cartId: '123456789' });
      expect(mockResponse.status).not.toHaveBeenCalled();
    });


    it('should handle errors and return an error response', async () => {
      const mockError = new Error('An error occurred');
      Cart.mockImplementationOnce(() => ({
        save: jest.fn().mockRejectedValueOnce(mockError),
      }));

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      await createNewCart({}, mockResponse);

      expect(Cart).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });

  describe('addItemToCart', () => {

    it('should add a new item to the cart', async () => {
      const mockProduct = { _id: 'product123', name: 'Test Product' };
      const mockCartItem = {
        productId: 'product123',
        name: 'Test Product',
        quantity: 2,
        totalPrice: 100,
      };
      const mockCart = {
        items: [mockCartItem],
        totalPrice: 100,
        save: jest.fn().mockReturnValue({}),
      };
      const mockRequest = {
        body: {
          productId: 'product123',
          quantity: 2,
        },
      };
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };


      jest.spyOn(Product, 'findById').mockReturnValue(mockProduct);
      jest.spyOn(Cart, 'findOne').mockReturnValue(null);
      jest.spyOn(Cart.prototype, 'save').mockReturnValue(mockCart);

      await addItemToCart(mockRequest, mockResponse);


      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockCart.items.length).toBe(1);
      expect(mockCart.items[0]).toEqual(mockCartItem);
      expect(mockCart.totalPrice).toBe(100);
    });

    it('should handle internal server error', async () => {
      const mockProduct = { _id: 'product123', name: 'Test Product' };
      const mockRequest = {
        body: {
          productId: 'product123',
          quantity: 2,
        },
      };
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      jest.mock('../models/product', () => ({
        findById: jest.fn().mockResolvedValueOnce(mockProduct),
      }));
      jest.mock('../models/cart', () => ({
        findOne: jest.fn().mockRejectedValueOnce(new Error('Internal Server Error')),
      }));

      await addItemToCart(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('cartDetails', () => {
    it('should retrieve cart details successfully', async () => {
      const mockCart = {
        _id: 'cart123',
        items: [
          { productId: 'product1', quantity: 2, totalPrice: 100 },
          { productId: 'product2', quantity: 3, totalPrice: 150 },
        ],
        totalPrice: 250,
      };
      const mockRequest = {};
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      jest.spyOn(Cart, 'findOne').mockResolvedValueOnce(mockCart);

      await getCartDetails(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith(mockCart);
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should handle cart not found error', async () => {
      const mockRequest = {};
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      jest.spyOn(Cart, 'findOne').mockResolvedValueOnce(null);

      await getCartDetails(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Cart not found' });
    });

  });

  describe('updateQuantity', () => {
    it('should update the quantity of an existing item in the cart', async () => {
      const mockItemId = 'item123';
      const mockQuantity = 5;
      const mockProduct = { _id: 'product123', price: 10 };
      const mockCartItem = {
        _id: 'item123',
        productId: 'product123',
        quantity: 3,
        totalPrice: 30,
      };
      const mockCart = {
        items: [mockCartItem],
        totalPrice: 30,
        save: jest.fn().mockResolvedValueOnce({}),
      };
      const mockRequest = {
        params: { itemId: mockItemId },
        body: { quantity: mockQuantity },
      };
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      jest.spyOn(Cart, 'findOne').mockResolvedValueOnce(mockCart);
      jest.spyOn(Product, 'findById').mockResolvedValueOnce(mockProduct);
      jest.spyOn(mockCart.items, 'find').mockReturnValueOnce(mockCartItem);
      jest.spyOn(mockCart, 'save');

      await updateQuantity(mockRequest, mockResponse);

      expect(mockCartItem.quantity).toBe(mockQuantity);
      expect(mockCartItem.totalPrice).toBe(50);
      expect(mockCart.totalPrice).toBe(50);
      expect(mockCart.save).toHaveBeenCalled();
      expect(mockCart.save).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should return an error response when attempting to update the quantity of a non-existing item', async () => {
      const mockItemId = 'item123';
      const mockQuantity = 5;
      const mockCart = null;
      const mockRequest = {
        params: { itemId: mockItemId },
        body: { quantity: mockQuantity },
      };
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      jest.spyOn(Cart, 'findOne').mockResolvedValueOnce(mockCart);

      await updateQuantity(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Cart not found' });
    });


  });

  describe('removeItemFromCart', () => {
    it('should remove an existing item from the cart', async () => {
      const mockItemId = 'item123';
      const mockCartItem = {
        _id: 'item123',
        productId: 'product123',
        quantity: 3,
        totalPrice: 30,
      };
      const mockCart = {
        items: [mockCartItem],
        totalPrice: 30,
        save: jest.fn().mockResolvedValueOnce({}),
      };
      const mockRequest = {
        params: { itemId: mockItemId },
      };
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      jest.spyOn(Cart, 'findOne').mockResolvedValueOnce(mockCart);

      await removeItemFromCart(mockRequest, mockResponse);

      expect(mockCart.totalPrice).toBe(0);
      expect(mockCart.items.length).toBe(0);
      expect(mockCart.save).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should return an error response when attempting to remove a non-existing item', async () => {
      const mockItemId = 'item123';
      const mockCart = null;
      const mockRequest = {
        params: { itemId: mockItemId },
      };
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      jest.spyOn(Cart, 'findOne').mockResolvedValueOnce(mockCart);

      await removeItemFromCart(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Cart not found' });
    });
  })

});
