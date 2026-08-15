const productService = require("../services/product.service");

class ProductController {
  async getProducts(req, res, next) {
    try {
      const products = await productService.getProducts();
      res.status(200).json({ success: true, message: "Success", data: products });
    } catch (error) {
      next(error);
    }
  }

  async getProduct(req, res, next) {
    try {
      const product = await productService.getProductById(req.params.id);
      res.status(200).json({ success: true, message: "Success", data: product });
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req, res, next) {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json({ success: true, message: "Created", data: product });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      res.status(200).json({ success: true, message: "Updated", data: product });
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      await productService.deleteProduct(req.params.id);
      res.status(200).json({ success: true, message: "Deleted", data: {} });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();
