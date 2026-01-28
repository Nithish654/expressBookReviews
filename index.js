// @ts-nocheck
const express = require("express");
const session = require("express-session");

const app = express();
app.use(express.json());

app.use(
  session({
    secret: "secret_key",
    resave: true,
    saveUninitialized: true,
  }),
);

// Import Routes
const general_routes = require("./general.js").general;
const auth_routes = require("./auth_users.js").authenticated;

// Route mapping
app.use("/customer", auth_routes);
app.use("/", general_routes);

app.listen(5000, () => console.log("Server running on port 5000"));
