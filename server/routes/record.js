const express = require("express");
const fs = require ("fs");
const formidable = require ("formidable"); // file upload component
const path = require("path");

var tDataBuf; 
var imageName;

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;


// This section will help you get a list of all the records.
recordRoutes.route("/record").get(function (req, res) {
  //console.log ("server API: read records called. ");
  let db_connect = dbo.getDb("mydb");
  db_connect
    .collection("records")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you get a single record by id
recordRoutes.route("/record/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  db_connect
      .collection("records")
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
      });
});

// This section will help you create a new record.
recordRoutes.route("/record/add").post(function (req, response) {
  console.log ("serverAPI add tDataBuf imageName " + imageName );
  if (tDataBuf) console.log (`${tDataBuf.length}`);

  let db_connect = dbo.getDb();
  let myobj = {
    name: req.body.name,
    position: req.body.position,
    level: req.body.level,
    imgDataStr : tDataBuf, 
  };
  db_connect.collection("records").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
  tDataBuf = "";
});

// This section will help you update a record by id.
recordRoutes.route("/update/:id").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  
  console.log ("serverAPI update tDataBuf imageName " + imageName );
  if (tDataBuf) console.log (`${tDataBuf.length}`);

  let newvalues = {
    $set: {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
      imgDataStr: tDataBuf, 
    },
  };

  db_connect
    .collection("records")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("server API: 1 document updated ", res.modifiedCount);
      response.json(res);
    });
    tDataBuf = "";
});

// This section will help you delete a record
recordRoutes.route("/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  db_connect.collection("records").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted ", obj.deletedCount, myquery);
    response.json(obj);
  });
});


// This is server API end point for getting the file from browser and put to uploads folder
// app.use (./uploads) folder is needed otherwise server does not know where to copy it.
// formidable is needed. readfile is incoming file's name
// router is needed to define to have this /upload defined, so that http://localhost:5000/upload 
// is open to React JS for puttign the file in it. It can be also tested from POSTMAN Tool
 recordRoutes.route("/upload").post( async function (req, response) {
  //var inputData= req.body;
  console.log ("server API : uploadFile called.. ");

  const form = new formidable.IncomingForm ();
  form.parse (req, function (err, fields, files) {
     // got the file from brower form and now available in temp dir. will be written to new dir
     //console.log (files);

     let oldPath = files.readfile.filepath; // this is native raw file (readfile) is name of field passed from Form
     console.log (" uploaded temp Path " , oldPath);
     let newPath = path.join(__dirname, '../uploads') + '/' + files.readfile.originalFilename;
     var rawData = fs.readFileSync(oldPath);
     tDataBuf =  Buffer.from(rawData).toString('base64');
     imageName = files.readfile.originalFilename; 
     fs.writeFile (newPath, rawData, function (err) {
        if (err) console.log ("error writing file ", err.message);
        else console.log ("file written successfully ", fields);
     });

     console.log ("newpath" , newPath);
     return response.status (200).json ({state: 'uploaded ' + imageName});   
    });

    console.log ("serverAPI uploadFile Over.. ");
});


module.exports = recordRoutes;