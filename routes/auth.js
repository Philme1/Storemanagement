const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");


router.get("/register", (req, res) => {
  res.render("register");
})

router.post("/", (req, res) => {
  const {username, email, password} = req.body;

  let newUser = new User({
    username: username,
    email: email,
    password: password
  });

  User.register(newUser, password, (err, user) => {
    if(err) {
      return res.render("register", {errorMessage: err.message});
    } else {
    passport.authenticate("local")(req, res, function() {
      res.redirect("/products");
    });
    }
  });
});

//Show login form 
router.get("/login", (req, res) => {
  res.render("login")
})

//Handle Login logic
router.post("/login", passport.authenticate("local", {
  successRedirect: "/products",
  failureRedirect: "/users/login"
}), (req, res) => {});


//Logout Route
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/users/login");
})

module.exports = router;