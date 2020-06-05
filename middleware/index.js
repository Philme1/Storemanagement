const Product = require("../models/product");

module.exports = {
  isLoggedIn: (req, res, next) => {
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("/users/login");
  },

  checkProductOwnerShip: (req, res, next) => {
    if(req.isAuthenticated()) {
      Product.findById(req.params.id, (err, product) => {
        if(err){
          res.redirect("back")
        } else {
          if(product.author.id.equals(req.user.id)) {
            next();
          } else {
            res.redirect("back");
          }
        }
      })
    } else {
      res.redirect("back");
    }
  }
}