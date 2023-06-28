const Product = require('../models/product');
const { getAllProducts } = require('../controller/products.controller');

describe('getAllProducts', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return all products', async () => {
    const mockProducts = [
      { _id: 'product1', name: 'Product 1' },
      { _id: 'product2', name: 'Product 2' },
      { _id: 'product3', name: 'Product 3' },
    ];
    const mockRequest = {};
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    jest.spyOn(Product, 'find').mockResolvedValueOnce(mockProducts);

    await getAllProducts(mockRequest, mockResponse);

    expect(Product.find).toHaveBeenCalled();
    expect(mockResponse.json).toHaveBeenCalledWith(mockProducts);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should return an error response when an error occurs', async () => {
    const mockError = new Error('Internal Server Error');
    const mockRequest = {};
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    jest.spyOn(Product, 'find').mockRejectedValueOnce(mockError);

    await getAllProducts(mockRequest, mockResponse);

    expect(Product.find).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});
