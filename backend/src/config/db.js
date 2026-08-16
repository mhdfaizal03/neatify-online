const mongoose = require("mongoose");
const logger = require("./logger");
const Product = require("../models/Product");
const Settings = require("../models/Settings");
const Media = require("../models/Media");

const defaultProducts = [
  { id: 1, name: "HydroWash Foam", category: "wash", type: "SHAMPOO", price: 499, featured: 1, image: "assets/product-1.jpeg", badge: "BESTSELLER", description: "Concentrated pH-neutral foam shampoo.", points: ["Thick clingy foam", "Wax-safe formula", "Vibrant cherry scent"] },
  { id: 2, name: "GlossGuard Wax", category: "finish", type: "WAX", price: 899, featured: 2, image: "assets/product-2.jpeg", badge: "PREMIUM", description: "Premium carnauba paint sealant.", points: ["Ultra hydrophobic gloss", "Protects against UV", "Easy buff finish"] },
  { id: 3, name: "ApexGrip Towel", category: "tools", type: "TOWEL", price: 299, featured: 3, image: "assets/product-3.jpeg", badge: "ESSENTIAL", description: "Edgeless thick drying microfiber cloth.", points: ["1200 GSM high absorption", "Scratch-free drying", "Durable lint-free weave"] },
  { id: 4, name: "WheelArmor Gel", category: "finish", type: "CLEANER", price: 599, featured: 4, image: "assets/product-4.jpeg", badge: "NEW", description: "Heavy-duty wheel cleaner and brake dust remover.", points: ["Color-changing activation", "pH balanced", "Clings to vertical surfaces"] },
  { id: 5, name: "GlassShine Spray", category: "wash", type: "CLEANER", price: 349, featured: 5, image: "assets/product-5.jpeg", badge: "", description: "Streak-free automotive glass cleaner.", points: ["Ammonia-free formula", "Tint safe", "Cuts road film quickly"] },
  { id: 6, name: "TireGlow dressing", category: "finish", type: "GLOSS", price: 449, featured: 6, image: "assets/product-6.jpeg", badge: "", description: "Long-lasting satin tire shine.", points: ["Sling-free formula", "Deep wet look", "Water resistant shield"] },
  { id: 7, name: "InteriorRefresh Cleaner", category: "wash", type: "DETAILER", price: 499, featured: 7, image: "assets/product-7.jpeg", badge: "", description: "Multi-surface interior detailer spray.", points: ["Matte factory finish", "UV blockers built-in", "Anti-static dust guard"] },
  { id: 8, name: "FoamCannon Pro", category: "tools", type: "CANNON", price: 1499, featured: 8, image: "assets/product-8.jpeg", badge: "PRO CHOICE", description: "Adjustable snow foam lance for pressure washers.", points: ["Brass connection", "Variable spray pattern", "Thick foam generation"] },
  { id: 9, name: "DetailBrush Trio", category: "tools", type: "BRUSH", price: 399, featured: 9, image: "assets/product-9.jpeg", badge: "", description: "Soft boar hair detailing brushes.", points: ["Scratch-free bristles", "Ergonomic handles", "Chemical resistant construct"] },
  { id: 10, name: "Weekend Wash Kit", category: "kit", type: "KIT", price: 2499, featured: 10, image: "assets/product-10.jpeg", badge: "COMBO DEALS", description: "Complete routine kit for weekend detailing.", points: ["Includes HydroWash, GlossGuard & Towel", "Step-by-step wash manual", "Bonus application sponge"] }
];

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
      await Settings.create({
        freeShippingThreshold: 999,
        weekendKitIds: [1, 2, 4, 7],
        highlightProductId: 3,
        storeName: "Neatify",
        announcement: "Premium vehicle care, made simple.",
        announcementSub: "Free shipping on orders above ₹999.",
      });
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
