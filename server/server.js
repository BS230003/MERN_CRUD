const express = require("express");
const app = express();
const cors = require("cors");
var path = require ('path');

require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(require("./routes/record"));

// For file upload from browser or external client
app.use('/uploads/', express.static(path.join(__dirname, './', 'uploads')))

// get DB driver connection
const dbo = require("./db/conn");

app.listen(port, () => {
  //perform a database connection when server starts
    dbo.connectToServer( function(err) {
    if (err) console.error(err);
      dbo.println ('server,js', "Database connection is opened");
    });

    dbo.println('server.js', 'Server is running on port:'+ `${port}`);
});




  //Code Link
  //https://github.com/mongodb-developer/mern-stack-example/tree/main/mern
  //Tutorial
  //https://www.mongodb.com/languages/mern-stack-tutorial

//var dbo;
// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/mydb";
// MongoClient.connect(url, function(err, db) {
//   console.log("MongoClient.connect started!");
//   if (err) throw err;
//   console.log("Database created / connected!");
//   dbo = db.db("mydb");
// });
