const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User");

const router = express.Router();

router.get("/", (req, res) => {
    res.render("index", { user: req.user });
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", async (req, res) => {
    const { email, password, passwordSubmit } = req.body;
    const errors = [];

    if ( !email || !password || !passwordSubmit ) {
        await errors.push({message: "Fill all the fields!"});
        res.render("register", { errors, email });
    } else {
        const user = await User.findOne({ email });

        if ( user ) {
            await errors.push({message: "This email is alredy"});
            res.render("register", { errors, email });
        } else {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            const user = new User({email, password: hash});
            try {
                await user.save();
                res.render("login");
            } catch(err) {
                await errors.push({message: "Something went wrong"});
                res.render("register", { errors });
            }
        }
    }
});

router.post("/login", passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
}));

router.post("/logout", (req, res) => {
    req.logOut();
    res.redirect('/');
});

router.get("/login", (req, res) => {
    res.render("login");
});

module.exports = router;