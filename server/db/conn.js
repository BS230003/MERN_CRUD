const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017/";

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var _db;

module.exports = {
 connectToServer: function (callback) {
    console.log ("conn.js connecting to MongoDB.", url); 
    client.connect(function (err, db) {
      // Verify we got a good "db" object
      //console.log(" connecting to MongoDB." +  db); 
      if (db)
      {
        _db = db.db("mydb");
       console.log ('conn.js Successfully connected to MongoDB.'); 
      }
      return callback(err);
    });
  },

  getDb: function () {
    //console.log (" getDb called ");
    return _db;
  },

  println: function (cls, msg, msg1="")
  {
  var jsonDate = (new Date()).toJSON();
  console.log (jsonDate + " "+ cls + " :: " , msg, msg1 );
  },

};




// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/mydb";
// MongoClient.connect(Db, function(err, db) {
//   console.log("MongoClient.connect started!");    
//   if (err) throw err;
//   console.log("Database created / connected!");
//   _db = db.db("mydb");
// });
