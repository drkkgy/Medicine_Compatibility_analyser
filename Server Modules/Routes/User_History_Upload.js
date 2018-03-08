//Dependencies
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient,assert = require('assert');

// Routes
router.get('/test', function(req,res,next){
    
    res.send('API working')
});

router.post('/upload_user_history', (req,res,next)=>{


	MongoClient.connect('mongodb://ankit:1234567890@ds012198.mlab.com:12198/user_history_upload', (err,db)=> {

    assert.equal(null,err);
    console.log("Sucessfully connected to the mongodb client");
    // sending the information
  db.collection('User_History').insertOne({
  "User_Name": req.body.User_Name,	
  "Allergens":  req.body.Allergens,
  "Resistance": req.body.Resistance,
  "Pregnancy": req.body.Pregnancy,
  "diabetes": req.body.diabetes,
  "highBloodPressure": req.body.highBloodPressure,
  "highCholesterol": req.body.highCholesterol,
  "other": req.body.other,
  "geneticDisease": req.body.geneticDisease
})
.then(function(result) {
  // process result
  res.json({"message": "Data uploaded sucessfully"});
})
    
});



});

// Sending the data back to front end

router.get('/download_user_history/:User_Name',(req,res,next)=>{
	MongoClient.connect('mongodb://ankit:1234567890@ds012198.mlab.com:12198/user_history_upload', (err,db)=> {

    assert.equal(null,err);
    console.log("Sucessfully connected to the mongodb client");
    // sending the information
  db.collection('User_History').findOne({"User_Name": req.params.User_Name}
  
)
.then(function(result) {
  // process result
  if(result == null)
  {
  	res.json({"message":"this User does not exist"})
  }
  res.json(result);
})
    
});

});

//Return router

module.exports = router;