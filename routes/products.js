const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const { isLoggedIn, checkProductOwnerShip } = require("../middleware/index");

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
router.get("/new", isLoggedIn, (req, res) => {
  res.render("products/new", {product: new Product()})
});

//Create Route
router.post("/", isLoggedIn, async (req, res) => {
  
   const { name, costPrice, price, quantityPurchased, purchaseDate, availableItem, description } = req.body;

   const { username, id } = req.user;

    const product = new Product({
    name,
    costPrice,
    price,
    quantityPurchased,
    availableItem,
    description,
    purchaseDate: new Date(purchaseDate),
    author: {username, id}
  });

  try {
    await product.save();
    res.redirect(302, `/products/${product.id}`);
  } catch (err) {
    res.render("products/new", {product: product, errorMessage: "Please Enter all Fields"})
  }
});

//Show Route Route
router.get("/:id", isLoggedIn, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    res.render("products/show", { product: product} )
  } catch (err) {
    res.redirect('/')
  }
});

//Edit Route
router.get("/:id/edit", checkProductOwnerShip, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    res.render("products/edit", {product: product})
    } catch (err) {
      res.redirect("/products")
    }
});

//Update Route
router.put("/:id", checkProductOwnerShip, async (req, res) => {
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
router.delete("/:id", checkProductOwnerShip, async (req, res) => {
  let product;
  try {
    product = await Product.findById(req.params.id)
    await product.remove()
    res.redirect(302, "/");
  } catch (err) {
    res.redirect(404, "back", {errorMessage: "Could not remove this product"})
  }
})

module.exports = router;