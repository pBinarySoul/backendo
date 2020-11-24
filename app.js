const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const strategy = require("./passport");

const { PORT, SECRET, MONGO_URI } = require("./config");


passport.use(new LocalStrategy({ usernameField: 'email' }, strategy));
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(expressLayouts);
app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Connected to DB");
}).catch( err => {
    console.log("WTF", err);
});

app.use("/", require("./routes/index"));
app.use(express.static("public"));

app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`);
});