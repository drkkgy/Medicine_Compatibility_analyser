//Dependencies
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// Creating local storage 


if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

 //Creating storage object 
 const storage = require('multer-gridfs-storage') ({

 	url: 'mongodb://cluster0-shard-00-00-m00py.mongodb.net:27017/User_Report_Upload',
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
  mongoose.connect('mongodb+srv://drkkgy:1234567890@cluster0-m00py.mongodb.net/User_Report_Upload');
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
     filename: JSON.stringify(req.body.PatientName + Date.now())//<---------------------------------------------------------------------------change
    
  	});
  	// Creating the read Stream from where the video is (videopath)
  	//and pipe it into the database(using write stream)
  	fs.createReadStream(filePath).pipe(writestream);
  	writestream.on('close',function(file) {
  		console.log(file.filename + ' Written To DB');
  		res.json({"message":"File Uploaded sucessfully"})
  	});
  });
 });




//Return router

module.exports = router;