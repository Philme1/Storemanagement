const express = require("express");
const router = express.Router();
const Product = require("../models/product")

//Root Route
router.get("/", async (req, res) => {
  let products;
  try {
    products = await Product.find().sort({createdAt: "desc"}).limit(20).exec();
    res.render("products/index", {products: products});
  } catch (err) {
    products = []
  }
});

//New Route
router.get("/new", (req, res) => {
  res.render("products/new", {product: new Product()})
});

//Create Route
router.post("/", async (req, res) => {
  
   const { name, costPrice, price, quantityPurchased, purchaseDate, availableItem, description } = req.body;

  const product = new Product({
    name,
    costPrice,
    price,
    quantityPurchased,
    availableItem,
    description,
    purchaseDate: new Date(purchaseDate)
  });

  try {
    await product.save();
    res.redirect(`products/${product.id}`);
  } catch (err) {
    res.render("products/new", {product: product, errorMessage: "Please Enter all Fields"})
  }
});

//Show Route Route
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    res.render("products/show", { product: product} )
  } catch (err) {
    res.redirect('/')
  }
});

//Edit Route
router.get("/:id/edit", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    res.render("products/edit", {product: product})
    } catch (err) {
      res.redirect("/products")
    }
});

//Update Route
router.put("/:id", async (req, res) => {
  const { name, costPrice, price, quantityPurchased, purchaseDate, availableItem, description } = req.body;

  let product = {name, costPrice, price, quantityPurchased, purchaseDate, availableItem, description};

  product = await Product.findByIdAndUpdate(req.params.id, { $set: product }, { new: true } );

  try {
    await product.save();
    res.redirect(`/products/${req.params.id}`)
  } catch (err) {
   res.render(("products/edit"), {product: product})
  }
});

//Delete Route
router.delete("/:id", async (req, res) => {
  let product;
  try {
    product = await Product.findById(req.params.id)
    await product.remove()
    res.redirect("/products");
  } catch (err) {
    if(product != null) {
      res.render("products/show", {product: product, errorMessage: "Could not remove this Product"})
    } else {
      res.redirect("/")
    }
  }
})

module.exports = router;