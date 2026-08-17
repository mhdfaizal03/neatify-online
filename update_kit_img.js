const mongoose = require("mongoose");
require("dotenv").config({ path: "backend/.env" });
const Product = require("./backend/src/models/Product");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Product.findOneAndUpdate(
      { id: 10 },
      { image: "assets/product-10.jpeg" }
    );
    console.log("Updated kit image to assets/product-10.jpeg");
    process.exit(0);
  })
  .catch(err => console.error(err));
