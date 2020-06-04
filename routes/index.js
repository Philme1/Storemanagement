const express = require("express")
const router = express.Router();
const Product = require("../models/product");


router.get("/", async (req, res) => {
  let searchOptions = {};
  if(req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i")
  }
  try {
    const products = await Product.find(searchOptions).limit(5).exec();
    res.render("index", {products: products, searchOptions: req.query})
  } catch (err) {
    res.redirect("/")
  }
});

module.exports = router;