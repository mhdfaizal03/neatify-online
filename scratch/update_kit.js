const mongoose = require("mongoose");
require("dotenv").config({ path: "../backend/.env" });
const Product = require("../backend/src/models/Product");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Product.findOneAndUpdate(
      { id: 10 },
      {
        name: "Wash it. Own the shine.",
        price: 2496,
        badge: "THE WEEKEND KIT",
        description: "One focused setup for your weekend detail. Foam, tools and premium microfiber essentials in one kit.",
        isKit: true,
        image: "assets/bundle.jpg"
      }
    );
    console.log("Updated Product 10 successfully!");
    mongoose.disconnect();
  })
  .catch(err => console.error(err));
