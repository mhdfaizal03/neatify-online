const productRepository = require("../repositories/product.repository");

class ProductService {
  async getProducts(filter = {}) {
    return await productRepository.findAll(filter);
  }

  async getProductById(id) {
    const product = await productRepository.findById(id);
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }
    return product;
  }

  async createProduct(data) {
    return await productRepository.create(data);
  }

  async updateProduct(id, data) {
    const product = await productRepository.update(id, data);
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }
    return product;
  }

  async deleteProduct(id) {
    const product = await productRepository.softDelete(id);
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }
    return product;
  }

  async restoreProduct(id) {
    const product = await productRepository.restore(id);
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }
    return product;
  }
}

module.exports = new ProductService();
