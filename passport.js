const bcrypt = require("bcryptjs");
const User = require("./models/User");

const strategy = async (email, password, done) => {
    const user = await User.findOne({email});
    if ( !user ) {
        return done(null, false, { message: "No user with that email" });
    }

    try {
        const isMatch = await bcrypt.compare(password, user.password);
        
        if ( isMatch ) {
            return done(null, user);
        } else {
            return done(null, false, { message: "Password incorrect" });
        }
    } catch (e) {
        return done(e);
    }
};

module.exports = strategy;