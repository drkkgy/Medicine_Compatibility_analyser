//Dependencies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient,assert = require('assert');


// Routes
router.get('/test', function(req,res,next){
    
    res.send('API working')
});

router.post('/upload_user_details', (req,res,next)=>{


	MongoClient.connect('mongodb://ankit:1234567890@ds012198.mlab.com:12198/user_personal_details', (err,db)=> {

    assert.equal(null,err);
    console.log("Sucessfully connected to the mongodb client");
    // sending the information
  db.collection('User_Details').insertOne({
  "User_Name": req.body.User_Name, 
  "name": req.body.name,
  "gender": req.body.gender,
  "dob": req.body.dob,
  "age": req.body.age,
  "heght": req.body.heght,
  "weight":req.body.weight,
  "email": req.body.email,
  "phoneNo": req.body.phoneNo,
  "address": req.body.address,
  "state": req.body.state,
  "pinCode": req.body.pinCode
})
.then(function(result) {
  // process result
  res.json({"message": "Data uploaded sucessfully"});
})
    
});



});

router.get('/download_user_details/:User_Name', (req,res,next)=>{

 MongoClient.connect('mongodb://ankit:1234567890@ds012198.mlab.com:12198/user_personal_details', (err,db)=> {

    assert.equal(null,err);
    console.log("Sucessfully connected to the mongodb client");
    // sending the information
  db.collection('User_Details').findOne({"User_Name": req.params.User_Name}
  
)
.then(function(result) {
  // process result
  if(result == null)
  {
    res.json({"message":"This User does not exist"})
  }
  res.json(result);
})
    
});

})



//Return router

module.exports = router;
