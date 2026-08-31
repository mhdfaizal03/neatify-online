const mongoose = require("mongoose");
const logger = require("./logger");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    logger.info("Using existing MongoDB connection");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/neatify", {
      serverSelectionTimeoutMS: 5000 // Fails fast if no DB
    });
    isConnected = conn.connections[0].readyState === 1;
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
    } else {
      // Check if at least one kit exists, otherwise seed the default kit
      const kitCount = await Product.countDocuments({ isKit: true });
      if (kitCount === 0) {
        const defaultKit = defaultProducts.find(p => p.isKit);
        if (defaultKit) {
          // Find max id to avoid duplicate key conflicts
          const maxProduct = await Product.findOne().sort("-id");
          const nextId = maxProduct && maxProduct.id ? maxProduct.id + 1 : 10;
          await Product.create({ ...defaultKit, id: nextId });
          logger.info(`Database Seeding: Default kit product seeded with ID ${nextId}.`);
        }
      }
    }

    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
      await Settings.create(defaultSettings);
      logger.info("Database Seeding: Default settings seeded.");
    } else {
      await Settings.updateOne({}, { $set: { weekendKitIds: [3, 5], highlightProductId: 1 } });
    }

    // Synchronize kit properties and authentic images
    await Product.updateMany({ category: "kit" }, { $set: { isKit: true } });
    
    // Set authentic image for Pressure Foam Sprayer
    await Product.updateMany(
      { $or: [{ name: /Foam Sprayer/i }, { id: 2 }, { id: 5 }] },
      { $set: { image: "assets/product-2.jpeg", images: ["assets/product-2.jpeg"] } }
    );
    
    // Set authentic image for Detail Brush / FoamCannon
    await Product.updateMany(
      { $or: [{ name: /Brush/i }, { id: 8 }] },
      { $set: { image: "assets/product-8.jpeg", images: ["assets/product-8.jpeg"] } }
    );

    // Clear removed dummy image paths for other products
    await Product.updateMany(
      { 
        $and: [
          { name: { $not: /Foam Sprayer/i } },
          { name: { $not: /Brush/i } },
          { id: { $nin: [2, 5, 8] } },
          { image: { $regex: /product-(1|3|4|5|6|7|9|10)\.jpeg/ } }
        ]
      },
      { $set: { image: "", images: [] } }
    );

    logger.info("Database Seeding: Synchronized kit properties and authentic images.");
  } catch (err) {
    logger.error(`Database Seeding Error: ${err.message}`);
  }
};

module.exports = connectDB;
