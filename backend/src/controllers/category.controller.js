const mongoose = require("mongoose");
const Category = require("../models/Category");
const { defaultCategories } = require("../config/constants");

class CategoryController {
  async getCategories(req, res, next) {
    try {
      if (mongoose.connection.readyState !== 1) {
        console.warn("Database not connected, returning fallback categories.");
        return res.status(200).json(defaultCategories);
      }

      const categories = await Category.find().sort("name");
      res.status(200).json(
        categories.map((c) => ({
          id: c.id,
          name: c.name,
        }))
      );
    } catch (error) {
      next(error);
    }
  }

  async createCategory(req, res, next) {
    try {
      if (mongoose.connection.readyState !== 1) {
        return res.status(400).json({ error: "Database not connected. Cannot perform write operations." });
      }

      const { id, name } = req.body;
      if (!id || !name) {
        return res.status(400).json({ error: "ID and Name are required" });
      }

      const normalizedId = id.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "");
      if (!normalizedId) {
        return res.status(400).json({ error: "Invalid Category ID/Slug" });
      }

      // Check if already exists
      const existing = await Category.findOne({ id: normalizedId });
      if (existing) {
        return res.status(400).json({ error: "Category ID already exists" });
      }

      const category = await Category.create({
        id: normalizedId,
        name: name.trim(),
      });

      res.status(201).json({
        id: category.id,
        name: category.name,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req, res, next) {
    try {
      if (mongoose.connection.readyState !== 1) {
        return res.status(400).json({ error: "Database not connected. Cannot perform write operations." });
      }

      const { id } = req.params;
      const category = await Category.findOne({ id });
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      await Category.deleteOne({ id });
      res.status(200).json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CategoryController();
