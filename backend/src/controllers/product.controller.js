const mongoose = require("mongoose");
const productService = require("../services/product.service");
const { defaultProducts } = require("../config/constants");

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
    isKit: p.isKit === true,
    includedProducts: p.includedProducts || [],
    stock: p.stock !== undefined ? p.stock : 20,
    status: p.status || "Active",
  };
};

class ProductController {
  async getProducts(req, res, next) {
    try {
      // Check database connection
      if (mongoose.connection.readyState === 0) {
        console.warn("Database not connected, returning fallback products.");
        return res.status(200).json(defaultProducts.filter(p => p.active !== false));
      }

      // Storefront: only show active products
      const products = await productService.getProducts({ active: true });
      res.status(200).json(products.map(formatProduct));
    } catch (error) {
      next(error);
    }
  }

  async getAllProducts(req, res, next) {
    try {
      if (mongoose.connection.readyState === 0) {
        console.warn("Database not connected, returning fallback products.");
        return res.status(200).json(defaultProducts);
      }

      // Admin: show all products
      const products = await productService.getProducts({});
      res.status(200).json(products.map(formatProduct));
    } catch (error) {
      next(error);
    }
  }

  async getProduct(req, res, next) {
    try {
      if (mongoose.connection.readyState === 0) {
        const product = defaultProducts.find(p => String(p.id) === String(req.params.id));
        if (!product) return res.status(404).json({ error: "Product not found" });
        return res.status(200).json(product);
      }

      const product = await productService.getProductById(req.params.id);
      res.status(200).json(formatProduct(product));
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req, res, next) {
    try {
      if (mongoose.connection.readyState === 0) {
        return res.status(400).json({ error: "Database not connected. Cannot perform write operations." });
      }

      const product = await productService.createProduct(req.body);
      res.status(201).json(formatProduct(product));
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      if (mongoose.connection.readyState === 0) {
        return res.status(400).json({ error: "Database not connected. Cannot perform write operations." });
      }

      const product = await productService.updateProduct(req.params.id, req.body);
      res.status(200).json(formatProduct(product));
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      if (mongoose.connection.readyState === 0) {
        return res.status(400).json({ error: "Database not connected. Cannot perform write operations." });
      }

      await productService.deleteProduct(req.params.id);
      res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  async restoreProduct(req, res, next) {
    try {
      if (mongoose.connection.readyState === 0) {
        return res.status(400).json({ error: "Database not connected. Cannot perform write operations." });
      }

      const product = await productService.restoreProduct(req.params.id);
      res.status(200).json(formatProduct(product));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();
