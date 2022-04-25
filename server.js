const express = require("express");
const serverConfig = require("./configs/server.config");
const mongoose = require("mongoose");
const dbConfig = require("./configs/db.config");
const bodyParser = require("body-parser");
const User = require("./models/user.model");
const bcrypt = require("bcryptjs");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
/**
 * Setup mongoDb connection and create an ADMIN user
 */
mongoose.connect(dbConfig.DB_URL, () => {
    console.log("Connected to mongoDB.");
    // initialisation
    init();
})

async function init() {
    // create the admin user
    let user = await User.findOne({ userId: "admin" });
    if (user) {
        return;
    } else {
        const user = await User.create({
            name: "Aryan",
            userId: "admin",
            email: "admin@gmail.com",
            userType: "ADMIN",
            password: bcrypt.hashSync("admin", 8)
        })
        console.log("ADMIN user is created");
    }
}

require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/ticket.routes")(app);
// Start the express server
app.listen(serverConfig.PORT, () => {
    console.log("Application has started on the port", serverConfig.PORT);
})