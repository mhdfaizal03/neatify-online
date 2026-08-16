const productService = require("../services/product.service");

const formatProduct = (p) => {
  if (!p) return null;
  return {
    id: p.id || p._id.toString(),
    _id: p._id.toString(),
    name: p.name,
    category: p.category,
    type: p.type || "",
    price: p.price,
    featured: p.featured || 0,
    image: p.image || "",
    badge: p.badge || "",
    description: p.description || "",
    points: p.points || [],
    active: p.active !== false,
    status: p.status || "Active",
  };
};

class ProductController {
  async getProducts(req, res, next) {
    try {
      // Storefront: only show active products
      const products = await productService.getProducts({ active: true });
      res.status(200).json(products.map(formatProduct));
    } catch (error) {
      next(error);
    }
  }

  async getAllProducts(req, res, next) {
    try {
      // Admin: show all products
      const products = await productService.getProducts({});
      res.status(200).json(products.map(formatProduct));
    } catch (error) {
      next(error);
    }
  }

  async getProduct(req, res, next) {
    try {
      const product = await productService.getProductById(req.params.id);
      res.status(200).json(formatProduct(product));
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req, res, next) {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json(formatProduct(product));
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      res.status(200).json(formatProduct(product));
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      await productService.deleteProduct(req.params.id);
      res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  async restoreProduct(req, res, next) {
    try {
      const product = await productService.restoreProduct(req.params.id);
      res.status(200).json(formatProduct(product));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();
