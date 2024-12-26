const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect() {
  // mongodb+srv://ohminedaka:<db_password>@cluster0.j049n.mongodb.net/
  mongoose
    // .connect("mongodb+srv://ohminedaka:vuduy2003@cluster0.j049n.mongodb.net/")
    .connect("mongodb+srv://tienduong:20031980@cluster0.2tde3.mongodb.net/")
    .then(() => {
      console.log("Successfully connected to MongoDB Atlas!");
    })
    .catch((error) => {
      console.log("Unable to connect to MongoDB Atlas!");
      console.error(error);
    });
}

module.exports = dbConnect;
