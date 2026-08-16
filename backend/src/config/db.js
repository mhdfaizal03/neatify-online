const mongoose = require("mongoose");
const logger = require("./logger");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/neatify");
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    
    // Seed initial collections if empty
    await seedDB();
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
  }
};

const seedDB = async () => {
  try {
    const Product = require("../models/Product");
    const Category = require("../models/Category");
    const Settings = require("../models/Settings");
    const { defaultProducts, defaultSettings, defaultCategories } = require("./constants");

    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      await Category.insertMany(defaultCategories);
      logger.info("Database Seeding: Default categories seeded.");
    }

    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(defaultProducts);
      logger.info("Database Seeding: Default products seeded.");
    }

    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
      await Settings.create(defaultSettings);
      logger.info("Database Seeding: Default settings seeded.");
    }
  } catch (err) {
    logger.error(`Database Seeding Error: ${err.message}`);
  }
};

module.exports = connectDB;
