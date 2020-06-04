if(process.env.NODE_ENV !== "production") {
  require("dotenv").config({path: '.env' });
}

const express = require("express");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy
const expressLayout = require("express-ejs-layouts");
const ejs = require("ejs");
const methodOverride = require("method-override");
const mongoose = require("mongoose");


const app = express();

//DATABASE CONNECTION
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false});
const db = mongoose.connection
db.on("error", error => console.error(error))
db.once("open", () => console.log("Connected To Database"))

const session = require("express-session");
const User = require("./models/user");

//Passport Authentication
const passSecret = process.env.PASSPORT_SECRET;
app.use(session({
  secret: passSecret,
  resave: false,
  saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Locals
app.use((req, res, next) =>{
  res.locals.currentUser = req.user;
  res.locals.searchOptions = req.query;
  next();
});


app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayout);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

//Routes
app.use("/", require("./routes/index"))
app.use("/users", require("./routes/auth"));
app.use("/products", require("./routes/products"));

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server Running on ${PORT}`))
