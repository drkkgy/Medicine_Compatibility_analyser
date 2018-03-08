//Dependencies
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MongoClient = require('mongodb').MongoClient,assert = require('assert');
var fs = require('fs');


// Creating local storage 


if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

 //Creating storage object 
 const storage = require('multer-gridfs-storage') ({

 	url: 'mongodb://ankit:1234567890@ds012188.mlab.com:12188/user_report_upload',
 	file: (req,file) => {
      if(file.mimetyoe === 'image/jpeg')  {
      	return {
        bucketName: 'file_' + Date.now()
      	};
      } else {
      	return null;
      }
 	}

 });

 // setting multer storage engine to the newly created object
  
// Routes
router.get('/test', function(req,res,next){
    
    res.send('API working')
});



router.post('/upload',(req, res,next)=> {
 // establish a connection
 var nPromise = new Promise(function(resolve, err){
   

  mongoose.connect('mongodb://ankit:1234567890@ds012188.mlab.com:12188/user_report_upload');
  var conn = mongoose.connection;
  var path = require('path');
  //require GridFs
  var Grid = require('gridfs-stream');
  //require filesystem module
  var fs = require('fs');
  // where to find the video in the filesystem that we will store in the DB
  var filePath = req.body.FilePath;
  //var videoPath = path.join(__dirname,'../Routes/readFrom/200Back.png');//<-------------------------------------edit this
  Grid.mongo = mongoose.mongo;
  // Connect GridFS and Mongo
  conn.once('open', function(){
  	console.log('-Connection open-');
  	var gfs = Grid(conn.db);
  	// Writing the file
  	var writestream = gfs.createWriteStream({
     // File name in mongodb
     filename: JSON.stringify(req.body.PatientName)//<---------------------------------------------------------------------------change
    
  	});
  	// Creating the read Stream from where the video is (videopath)
  	//and pipe it into the database(using write stream)
  	fs.createReadStream(filePath).pipe(writestream);
  	writestream.on('close',function(file) {
  		console.log(file.filename + ' Written To DB');
  		res.json({"message":"File Uploaded sucessfully"})
  	});

    writestream.on('error', function (err) {
      console.log('An error occurred!', err);
      throw err;
      res.json({"message":"cannot get the file"});
    });
  });

});
 });


//-------------------------------------------

router.get('/download/:User_Name',(req,res,next) =>{

var Grid = require('gridfs-stream');
var mongoose = require("mongoose");
Grid.mongo = mongoose.mongo;
var gfs = new Grid(mongoose.connection.db);


gfs.files.find({ "filename": req.params.User_Name }).toArray(function (err, files) {

    if(files.length===0){
        return res.status(400).send({
            message: 'File not found'
        });
    }

    res.writeHead(200, {'Content-Type': files[0].contentType});

    var readstream = gfs.createReadStream({
          filename: files[0].filename
    });

    readstream.on('data', function(chunk) {
        res.write(chunk);
    });

    readstream.on('end', function() {
        res.end();        
    });

    readstream.on('error', function (err) {
      console.log('An error occurred!', err);
      throw err;
      res.json({"message":"cannot get the file"});
    });
  });
});



//Return router

module.exports = router;