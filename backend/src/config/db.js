const mongoose = require("mongoose");
const logger = require("./logger");
const Product = require("../models/Product");
const Settings = require("../models/Settings");
const Media = require("../models/Media");
const { defaultProducts, defaultSettings } = require("./constants");

const seedDatabase = async () => {
  try {
    // Check and seed Products
    const productCount = await Product.countDocuments({ isDeleted: false });
    if (productCount === 0) {
      logger.info("Products collection empty, seeding default products...");
      await Product.insertMany(defaultProducts);
      logger.info("Products seeded successfully.");
    }

    // Check and seed Settings
    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
      logger.info("Settings collection empty, seeding default settings...");
      await Settings.create(defaultSettings);
      logger.info("Settings seeded successfully.");
    }

    // Check and seed default Media library entries
    const mediaCount = await Media.countDocuments();
    if (mediaCount === 0) {
      logger.info("Media collection empty, seeding default media entries...");
      const defaultMediaEntries = defaultProducts.map((p) => ({
        name: p.name + " Image",
        url: p.image,
        size: 102400, // mock size 100KB
        source: "system",
      }));
      await Media.insertMany(defaultMediaEntries);
      logger.info("Media library seeded successfully.");
    }
  } catch (error) {
    logger.error(`Database seeding error: ${error.message}`);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/neatify", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    
    // Run database auto-seeder
    await seedDatabase();
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
  }
};

module.exports = connectDB;
