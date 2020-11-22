const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const mongoose = require("mongoose");

const { PORT, mongoURI } = require("./config");

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(expressLayouts);

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Connected to DB");
}).catch( err => {
    console.log("WTF", err);
});

app.use("/", require("./routes/index"));
app.use(express.static("public"));

app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`);
});