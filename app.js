const express = require("express");
const mongoose = require("mongoose");
const Order = require("./models/orderModel");
const ParentProduct = require("./models/parentProductModel");
const Vendor = require("./models/vendorModel");
require("dotenv").config();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const uri = process.env.DB_URL;
const cors = require("cors");

app.use(cors());

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB'ye başarıyla bağlanıldı!"))
  .catch((err) => console.error("MongoDB bağlantı hatası:", err));

app.get("/api/sales", async (req, res) => {
  const vendorId = req.query.vendor;
  const productId = req.query.product;
  const query = {};
  if (vendorId) query["cart_item.vendor"] = vendorId;
  if (productId) query["cart_item.product"] = productId;

  try {
    const totalSales = await Order.aggregate([
      { $unwind: "$cart_item" },
      { $match: query },
      {
        $group: {
          _id: "$cart_item.product",
          totalSold: { $sum: "$cart_item.quantity" },
        },
      },
    ]);
    res.json(totalSales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/parent-products", async (req, res) => {
  try {
    const parentProducts = await ParentProduct.find().populate("vendor");
    res.json(parentProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/vendors", async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/sales-by-vendor", async (req, res) => {
  const vendorId = req.query.vendor;
  if (!vendorId) {
    return res.status(400).json({ error: "Vendor ID is required" });
  }

  try {
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    const salesData = await Order.aggregate([
      { $unwind: "$cart_item" },
      {
        $lookup: {
          from: "parentproducts",
          localField: "cart_item.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      { $match: { "productDetails.vendor": vendor._id } },
      {
        $group: {
          _id: "$productDetails.name",
          totalSold: { $sum: "$cart_item.quantity" },
        },
      },
    ]);

    res.json(salesData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use(express.static(path.join(__dirname, "frontend")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor...`));
