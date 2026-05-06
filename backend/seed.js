require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");
const products = require("./data/products");

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("MONGO_URI is required in .env");
  process.exit(1);
}

async function seed() {
  await mongoose.connect(mongoUri, {
    dbName: "chic-style-hub",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const count = await Product.countDocuments();
  if (count > 0) {
    console.log(`Database already contains ${count} products. Seed skipped.`);
    process.exit(0);
  }

  await Product.create(products);
  console.log(`Seeded ${products.length} products.`);
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
