const router = require("express").Router();
const Order = require("../models/Order");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.post("/", auth, async (req, res) => {
  try {
    const { items, total, payment, shippingAddress } = req.body;
    if (!Array.isArray(items) || items.length === 0 || typeof total !== "number" || !payment || !shippingAddress) {
      return res.status(400).json({ message: "Missing order data" });
    }

    const order = await Order.create({
      userId: req.user.id,
      items,
      total,
      payment,
      shippingAddress,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to create order" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const filter = req.user.isAdmin ? {} : { userId: req.user.id };
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch orders" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (!req.user.isAdmin && order.userId !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch order" });
  }
});

router.put("/:id/status", auth, admin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to update order status" });
  }
});

module.exports = router;
