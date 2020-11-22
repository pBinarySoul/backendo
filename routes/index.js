const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", (req, res) => {
    const { email, password, passwordSubmit } = req.body;
    const errors = [];

    if ( !email || !password || !passwordSubmit ) {
        errors.push({message: "Fill all the fields!"});
        res.render("register", { errors, email });
    } else {
        User.findOne({ email }).then( user => {
            if ( user ) {
                errors.push({message: "This email is alredy"});
                res.render("register", { errors, email });
            } else {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        const user = new User({email, password: hash});
                        user.save().then( () => {
                            res.render("login");
                        }).catch(() => {
                            errors.push({message: "Something went wrong"});
                            res.render("register", { errors });
                        });
                    });
                });
            }
        });
    }
});

router.get("/login", (req, res) => {
    res.render("login");
});

module.exports = router;