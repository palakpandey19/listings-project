if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}
const express = require("express");
const app = express();
const port = 8080;
const session = require("express-session");
const connectFlash = require("connect-flash");
const mongoStore = require("connect-mongo").default;
const methodOverride = require("method-override");
const Eerror = require("./utils/eerror.js");
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
const path = require("path");
app.use(express.static(path.join(__dirname, "/public")));
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
const user = require("./models/user.js");
const passport = require("passport");
const localStrategy = require("passport-local");

const listings = require("./routes/listing.js");

const reviews = require("./routes/review.js");

const users = require("./routes/user.js");

const dbUrl = process.env.connecturl;
async function main() {
    await mongoose.connect(dbUrl);
}
main().then(()=>{
    console.log("connection of mongoose to the node js is done.");
})
.catch((err)=>{
    console.log("error occured:", err);
});
const store = mongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.secret
    },
    touchAfter: 24*3600
});
store.on("error", ()=>{
    console.log("error occured in mongo db session store", error);
});
const secretOptions = {
    store : store,
    secret : process.env.secret,
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires : Date.now()+7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly : true
    } 
};

app.use(session(secretOptions));
app.use(connectFlash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", users);

app.get("/", (req,res)=>{
    res.send("root is working.");
});
app.all("/*splat", (req,res,next)=>{
    next(new Eerror(404, "Page not found!"));
});
app.use((err, req, res, next)=>{
    let {status=500, message="Something went wrong"} = err;
    res.render("listings/error.ejs", {err});
});
app.listen(port, (req,res)=>{
    console.log("app is listening to your request.");
});