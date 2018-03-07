//Dependencies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = express.Router();
var router = express.Router();
var MongoClient = require('mongodb').MongoClient,assert = require('assert');


// Routes
router.get('/test', function(req,res,next){
    
    res.send('API working')
});

router.post('/upload_user_details', (req,res,next)=>{


	MongoClient.connect('mongodb://localhost:27017/User_Personal_Details', (err,db)=> {

    assert.equal(null,err);
    console.log("Sucessfully connected to the mongodb client");
    // sending the information
  db.collection('User_Details').insertOne({
  "name": req.body.name,
  "gender": req.body.gender,
  "dob": req.body.dob,
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




//Return router

module.exports = router;
