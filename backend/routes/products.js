const router = require("express").Router();
const Product = require("../models/Product");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/", async (req, res) => {
  try {
    const { category, q } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (q) {
      const regex = new RegExp(q.toString(), "i");
      filter.$or = [
        { name: regex },
        { brand: regex },
        { subcategory: regex },
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch products" });
  }
});

router.get("/category/:category", async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch products by category" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const q = req.query.q?.toString() || "";
    const regex = new RegExp(q, "i");
    const products = await Product.find({
      $or: [{ name: regex }, { brand: regex }, { subcategory: regex }, { category: regex }],
    }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to search products" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch product" });
  }
});

router.post("/", auth, admin, async (req, res) => {
  try {
    const { id, name, brand, price, mrp, image, category, subcategory, fastDelivery } = req.body;
    if (!id || !name || !brand || !price || !mrp || !image || !category || !subcategory) {
      return res.status(400).json({ message: "Missing required product fields" });
    }

    const existing = await Product.findOne({ id });
    if (existing) {
      return res.status(409).json({ message: "Product with this id already exists" });
    }

    const product = await Product.create({ id, name, brand, price, mrp, image, category, subcategory, fastDelivery: !!fastDelivery });
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to create product" });
  }
});

router.put("/:id", auth, admin, async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.id;

    const product = await Product.findOneAndUpdate({ id: req.params.id }, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to update product" });
  }
});

router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to delete product" });
  }
});

module.exports = router;
